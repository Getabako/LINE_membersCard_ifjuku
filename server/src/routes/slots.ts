import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyLiffToken } from '../middleware/liffAuth.js';

const router = Router();
const prisma = new PrismaClient();

// 利用可能なスロット取得
router.get('/', verifyLiffToken, async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Date is required' });
      return;
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const endDate = new Date(targetDate);
    endDate.setDate(endDate.getDate() + 1);

    // 既存のスロットを取得
    let slots = await prisma.timeSlot.findMany({
      where: {
        date: {
          gte: targetDate,
          lt: endDate,
        },
      },
      orderBy: { time: 'asc' },
    });

    // スロットがない場合はデフォルトを生成
    if (slots.length === 0) {
      const defaultTimes = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

      await prisma.timeSlot.createMany({
        data: defaultTimes.map((time) => ({
          date: targetDate,
          time,
          capacity: 3,
          booked: 0,
        })),
      });

      slots = await prisma.timeSlot.findMany({
        where: {
          date: {
            gte: targetDate,
            lt: endDate,
          },
        },
        orderBy: { time: 'asc' },
      });
    }

    const formattedSlots = slots.map((slot) => ({
      id: slot.id,
      date: slot.date.toISOString(),
      time: slot.time,
      available: slot.booked < slot.capacity,
      remainingSeats: slot.capacity - slot.booked,
    }));

    res.json(formattedSlots);
  } catch (error) {
    next(error);
  }
});

export { router as slotRouter };
