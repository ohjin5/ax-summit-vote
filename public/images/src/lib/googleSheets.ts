import { google } from 'googleapis';

export interface SheetVoteRow {
  timestamp: string;
  voterId: string;
  thirdId: string;
  thirdTitle: string;
  secondId: string;
  secondTitle: string;
  firstId: string;
  firstTitle: string;
}

/**
 * Returns an authenticated Google Sheets API client if environment variables are set.
 */
export function getGoogleSheetsClient() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !clientEmail || !privateKey) {
    return null;
  }

  // Handle newline characters in private key string
  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return { sheets, spreadsheetId: sheetId };
  } catch (error) {
    console.error('Failed to initialize Google Sheets client:', error);
    return null;
  }
}

/**
 * Ensures that the 'Votes' sheet exists and has the proper header row.
 */
export async function ensureVotesSheetHeader(): Promise<boolean> {
  const client = getGoogleSheetsClient();
  if (!client) return false;

  const { sheets, spreadsheetId } = client;

  try {
    // Check if Votes sheet has data
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Votes!A1:H1',
    });

    if (!res.data.values || res.data.values.length === 0) {
      // Append Header Row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Votes!A1:H1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              'timestamp',
              'voterId',
              'thirdId',
              'thirdTitle',
              'secondId',
              'secondTitle',
              'firstId',
              'firstTitle',
            ],
          ],
        },
      });
    }
    return true;
  } catch (err: any) {
    console.warn('Google Sheets header check failed:', err?.message || err);
    return false;
  }
}

/**
 * Appends a vote row to the 'Votes' sheet in Google Sheets.
 */
export async function appendVoteToSheet(row: SheetVoteRow): Promise<boolean> {
  const client = getGoogleSheetsClient();
  if (!client) {
    throw new Error('Google Sheets environment variables (GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY) are not configured.');
  }

  const { sheets, spreadsheetId } = client;

  // Make sure header exists
  await ensureVotesSheetHeader();

  const values = [
    [
      row.timestamp,
      row.voterId,
      row.thirdId,
      row.thirdTitle,
      row.secondId,
      row.secondTitle,
      row.firstId,
      row.firstTitle,
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Votes!A:H',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values,
    },
  });

  return true;
}

/**
 * Fetches all vote rows from the 'Votes' sheet in Google Sheets.
 */
export async function fetchVotesFromSheet(): Promise<SheetVoteRow[]> {
  const client = getGoogleSheetsClient();
  if (!client) {
    return [];
  }

  const { sheets, spreadsheetId } = client;

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Votes!A2:H',
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    return rows.map((r) => ({
      timestamp: r[0] || '',
      voterId: r[1] || '',
      thirdId: r[2] || '',
      thirdTitle: r[3] || '',
      secondId: r[4] || '',
      secondTitle: r[5] || '',
      firstId: r[6] || '',
      firstTitle: r[7] || '',
    }));
  } catch (err: any) {
    console.warn('Failed to fetch votes from Google Sheets:', err?.message || err);
    return [];
  }
}
