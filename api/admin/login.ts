import type { Request, Response } from 'express';
import { verifyAdminPassword } from '../../src/lib/votingService';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { password } = body;

    if (!password) {
      return res.status(400).json({ success: false, error: '비밀번호를 입력해주세요.' });
    }

    if (!verifyAdminPassword(password)) {
      return res.status(401).json({ success: false, error: '비밀번호가 일치하지 않습니다.' });
    }

    return res.status(200).json({
      success: true,
      message: '인증 성공',
      token: password, // Simple secure token matching ADMIN_PASSWORD
    });
  } catch (error: any) {
    console.error('API /api/admin/login error:', error);
    return res.status(500).json({ success: false, error: '서버 인증 처리 오류' });
  }
}
