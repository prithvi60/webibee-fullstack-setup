import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

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

    // Convert File to Readable Stream
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    // Upload file to Google Drive
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) {
      throw new Error("GOOGLE_DRIVE_FOLDER_ID is not defined");
    }

    const fileMetadata = {
      name: file.name,
      parents: [folderId],
    };

    const media = {
      mimeType: file.type,
      body: stream,
    };

    const uploadResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    const fileId = uploadResponse.data.id;

    // Set file permissions to public (anyone with the link)
    await drive.permissions.create({
      fileId: fileId!,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // List files in the specified folder
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
      message: "File uploaded successfully",
      fileId: fileId,
      fileURL: fileUrls.find((f) => f.id === fileId)?.url,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
