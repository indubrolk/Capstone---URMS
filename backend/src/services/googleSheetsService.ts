import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../../../.env.local'), override: true });

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];

/**
 * Initialize Google Sheets API with Service Account
 */
const getSheetsClient = async () => {
    let auth;
    
    // 1. Try loading from environment variable (JSON string)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        try {
            const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
            auth = new google.auth.GoogleAuth({
                credentials,
                scopes: SCOPES,
            });
        } catch (e) {
            console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON", e);
        }
    } 
    
    // 2. Fallback to serviceAccountKey.json if it exists (reusing Firebase key if applicable)
    if (!auth) {
        try {
            const keyPath = path.join(__dirname, '../config/serviceAccountKey.json');
            auth = new google.auth.GoogleAuth({
                keyFile: keyPath,
                scopes: SCOPES,
            });
        } catch (e) {
            // No auth available
        }
    }

    if (!auth) {
        throw new Error("Google Service Account credentials not configured. Please set GOOGLE_SERVICE_ACCOUNT_JSON in .env.local");
    }

    const client = await auth.getClient();
    return google.sheets({ version: 'v4', auth: client as any });
};

/**
 * Export data to a new Google Sheet
 */
export const exportToGoogleSheets = async (
    title: string,
    sheets: {
        name: string;
        headers: string[];
        rows: (string | number)[][];
    }[],
    userEmail?: string
) => {
    try {
        const sheetsClient = await getSheetsClient();
        
        // 1. Create a new Spreadsheet
        const spreadsheet = await sheetsClient.spreadsheets.create({
            requestBody: {
                properties: {
                    title: `${title} - ${new Date().toLocaleDateString()}`,
                },
            },
        });

        const spreadsheetId = spreadsheet.data.spreadsheetId;
        if (!spreadsheetId) throw new Error("Failed to create spreadsheet");

        // 2. Prepare updates for each sheet
        const requests: any[] = [];
        
        // Add new sheets if needed (the first one is created by default as 'Sheet1')
        for (let i = 0; i < sheets.length; i++) {
            const sheet = sheets[i];
            if (i === 0) {
                // Rename first sheet
                requests.push({
                    updateSheetProperties: {
                        properties: {
                            sheetId: 0,
                            title: sheet.name,
                        },
                        fields: 'title',
                    },
                });
            } else {
                // Add additional sheets
                requests.push({
                    addSheet: {
                        properties: {
                            title: sheet.name,
                        },
                    },
                });
            }
        }

        // Execute sheet creation/renaming
        await sheetsClient.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: { requests },
        });

        // 3. Write data to each sheet
        for (const sheet of sheets) {
            const values = [sheet.headers, ...sheet.rows];
            await sheetsClient.spreadsheets.values.update({
                spreadsheetId,
                range: `${sheet.name}!A1`,
                valueInputOption: 'RAW',
                requestBody: { values },
            });

            // Basic Formatting: Bold headers
            // Note: This requires more complex batchUpdate requests if needed.
            // For now, we'll stick to simple data injection as per "Scope: minimal and clean".
        }

        // 4. Share the sheet with the user (Important for service accounts!)
        if (userEmail && userEmail.includes('@')) {
            const auth = new google.auth.GoogleAuth({
                keyFile: path.join(__dirname, '../config/serviceAccountKey.json'),
                scopes: ['https://www.googleapis.com/auth/drive.file'],
            });
            // We need the Drive API to share
            const drive = google.drive({ version: 'v3', auth: (await auth.getClient()) as any });
            await drive.permissions.create({
                fileId: spreadsheetId,
                requestBody: {
                    role: 'writer',
                    type: 'user',
                    emailAddress: userEmail,
                },
            });
        }

        return {
            spreadsheetId,
            spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
        };
    } catch (error: any) {
        console.error("Google Sheets Export Error:", error);
        throw error;
    }
};
