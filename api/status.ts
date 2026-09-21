import type { Request, Response } from 'express';
import { getVotingStatus } from '../src/lib/votingService';
import { getGoogleSheetsClient } from '../src/lib/googleSheets';
import { TEAMS } from '../src/data/teams';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const isSheetsConnected = !!getGoogleSheetsClient();

  return res.status(200).json({
    success: true,
    data: {
      votingStatus: getVotingStatus(),
      isSheetsConnected,
      teams: TEAMS,
    },
  });
}
