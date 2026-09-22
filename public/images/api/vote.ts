import type { Request, Response } from 'express';
import { processVoteSubmission } from '../src/lib/votingService';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const result = await processVoteSubmission(body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('API /api/vote error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || '서버 처리 중 오류가 발생했습니다.',
    });
  }
}
