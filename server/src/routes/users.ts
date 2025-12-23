import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyLiffToken } from '../middleware/liffAuth.js';
import { generateMemberNumber } from '../services/memberService.js';

const router = Router();
const prisma = new PrismaClient();

// 自分の会員情報を取得
router.get('/me', verifyLiffToken, async (req, res, next) => {
  try {
    let user = await prisma.user.findUnique({
      where: { lineUserId: req.lineUserId },
    });

    if (!user) {
      // 新規ユーザーの場合は自動登録
      user = await prisma.user.create({
        data: {
          lineUserId: req.lineUserId!,
          displayName: 'ユーザー',
          memberNumber: generateMemberNumber(),
          points: 100, // 初回登録ボーナス
        },
      });

      // 初回登録ボーナスの履歴
      await prisma.pointHistory.create({
        data: {
          userId: user.id,
          amount: 100,
          type: 'bonus',
          description: '初回登録ボーナス',
        },
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ポイント履歴を取得
router.get('/me/points', verifyLiffToken, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { lineUserId: req.lineUserId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const history = await prisma.pointHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(history);
  } catch (error) {
    next(error);
  }
});

// プロフィール更新
router.put('/me', verifyLiffToken, async (req, res, next) => {
  try {
    const { displayName, pictureUrl } = req.body;

    const user = await prisma.user.update({
      where: { lineUserId: req.lineUserId },
      data: {
        ...(displayName && { displayName }),
        ...(pictureUrl && { pictureUrl }),
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

export { router as userRouter };
