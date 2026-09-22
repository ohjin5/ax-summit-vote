import type { Request, Response } from 'express';
import { setVotingStatus, getVotingStatus, verifyAdminPassword } from '../../src/lib/votingService';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  const passwordHeader = req.headers['x-admin-password'];
  let token = '';

  if (passwordHeader && typeof passwordHeader === 'string') {
    token = passwordHeader;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token || !verifyAdminPassword(token)) {
    return res.status(401).json({ success: false, error: '관리자 인증이 필요합니다.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { status } = body;

    if (status === 'ACTIVE' || status === 'PAUSED') {
      setVotingStatus(status);
      return res.status(200).json({
        success: true,
        votingStatus: getVotingStatus(),
      });
    }

    return res.status(400).json({
      success: false,
      error: '올바르지 않은 상태값입니다. (ACTIVE 또는 PAUSED만 가능)',
    });
  } catch (error: any) {
    console.error('API /api/admin/status error:', error);
    return res.status(500).json({ success: false, error: '서버 처리 오류' });
  }
}
