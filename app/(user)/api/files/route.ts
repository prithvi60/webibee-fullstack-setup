import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Initialize Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    // List files in the specified folder
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType)",
    });

    const files = response.data.files || [];

    // Generate public URLs for each file
    const fileUrls = files.map((file) => ({
      id: file.id,
      name: file.name,
      url: `https://drive.google.com/uc?id=${file.id}`,
      mimeType: file.mimeType,
    }));

    return NextResponse.json({
      files: fileUrls,
    });
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}
