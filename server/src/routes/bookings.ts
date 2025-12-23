import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyLiffToken } from '../middleware/liffAuth.js';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const createBookingSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  timeSlot: z.string().min(1),
});

// 予約一覧取得
router.get('/', verifyLiffToken, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { lineUserId: req.lineUserId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

// 予約作成
router.post('/', verifyLiffToken, async (req, res, next) => {
  try {
    const validatedData = createBookingSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { lineUserId: req.lineUserId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // タイムスロットの空き確認
    const slot = await prisma.timeSlot.findFirst({
      where: {
        date: new Date(validatedData.date),
        time: validatedData.timeSlot,
      },
    });

    if (slot && slot.booked >= slot.capacity) {
      res.status(400).json({ error: 'This time slot is fully booked' });
      return;
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        date: new Date(validatedData.date),
        timeSlot: validatedData.timeSlot,
      },
    });

    // スロットの予約数を更新
    if (slot) {
      await prisma.timeSlot.update({
        where: { id: slot.id },
        data: { booked: { increment: 1 } },
      });
    }

    // 予約ボーナスポイント
    await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: 10 } },
    });

    await prisma.pointHistory.create({
      data: {
        userId: user.id,
        amount: 10,
        type: 'booking',
        description: '予約完了ボーナス',
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// 予約更新
router.put('/:id', verifyLiffToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = createBookingSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { lineUserId: req.lineUserId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const existingBooking = await prisma.booking.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingBooking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        date: new Date(validatedData.date),
        timeSlot: validatedData.timeSlot,
      },
    });

    res.json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// 予約キャンセル
router.delete('/:id', verifyLiffToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { lineUserId: req.lineUserId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const booking = await prisma.booking.findFirst({
      where: { id, userId: user.id },
    });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as bookingRouter };
