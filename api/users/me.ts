import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// 会員番号を生成
const generateMemberNumber = (): string => {
  const prefix = '0001';
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${random}-${suffix}`;
};

// LIFF認証
interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

async function verifyLiffToken(req: VercelRequest): Promise<LiffProfile | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const accessToken = authHeader.substring(7);

  if (accessToken === 'mock-access-token-for-development') {
    return { userId: 'U_dev_user_12345', displayName: '開発ユーザー' };
  }

  try {
    const response = await axios.get<LiffProfile>('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 認証
  const profile = await verifyLiffToken(req);
  if (!profile) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const lineUserId = profile.userId;

  try {
    if (req.method === 'GET') {
      // ユーザー情報を取得
      let user = await prisma.user.findUnique({
        where: { lineUserId },
      });

      if (!user) {
        // 新規ユーザーの場合は自動登録
        user = await prisma.user.create({
          data: {
            lineUserId,
            displayName: profile.displayName || 'ユーザー',
            pictureUrl: profile.pictureUrl,
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

      return res.status(200).json(user);
    }

    if (req.method === 'PUT') {
      // プロフィール更新
      const { displayName, pictureUrl } = req.body;

      const user = await prisma.user.update({
        where: { lineUserId },
        data: {
          ...(displayName && { displayName }),
          ...(pictureUrl && { pictureUrl }),
        },
      });

      return res.status(200).json(user);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
