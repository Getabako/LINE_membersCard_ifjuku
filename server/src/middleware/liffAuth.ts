import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const IS_DEV = process.env.NODE_ENV !== 'production';
const DEV_USER_ID = 'U_dev_user_12345';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      lineUserId?: string;
    }
  }
}

export const verifyLiffToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.headers.authorization?.replace('Bearer ', '');

  // 開発モード: トークンが開発用の場合はスキップ
  if (IS_DEV && accessToken === 'mock-access-token-for-development') {
    console.log('🔧 開発モード: 認証をスキップ');
    req.lineUserId = DEV_USER_ID;
    next();
    return;
  }

  // 開発モード: トークンがない場合もスキップ
  if (IS_DEV && !accessToken) {
    console.log('🔧 開発モード: トークンなしで認証をスキップ');
    req.lineUserId = DEV_USER_ID;
    next();
    return;
  }

  if (!accessToken) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const response = await axios.get<{ sub: string; expires_in: number }>(
      'https://api.line.me/oauth2/v2.1/verify',
      { params: { access_token: accessToken } }
    );

    if (response.data.expires_in <= 0) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }

    req.lineUserId = response.data.sub;
    next();
  } catch (error) {
    // 開発モードではエラーでも続行
    if (IS_DEV) {
      console.log('🔧 開発モード: トークン検証失敗、モックユーザーで続行');
      req.lineUserId = DEV_USER_ID;
      next();
      return;
    }

    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
