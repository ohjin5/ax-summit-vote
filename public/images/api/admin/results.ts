import type { Request, Response } from 'express';
import { calculateAdminResults, verifyAdminPassword } from '../../src/lib/votingService';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Admin Security Check
  const authHeader = req.headers.authorization;
  const passwordHeader = req.headers['x-admin-password'];
  let token = '';

  if (passwordHeader && typeof passwordHeader === 'string') {
    token = passwordHeader;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token || !verifyAdminPassword(token)) {
    return res.status(401).json({
      success: false,
      error: '관리자 인증이 필요합니다. 올바른 비밀번호를 제공해주세요.',
    });
  }

  try {
    const resultsData = await calculateAdminResults();
    return res.status(200).json({
      success: true,
      data: resultsData,
    });
  } catch (error: any) {
    console.error('API /api/admin/results error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || '결과를 조회하는 도중 오류가 발생했습니다.',
    });
  }
}
