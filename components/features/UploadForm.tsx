"use client";

import { CREATE_UPLOAD_FILE } from "@/utils/Queries";
import { useMutation } from "@apollo/client";
import { useState } from "react";

interface UploadFileResponse {
    uploadFile: {
        id: string;
        filename: string;
        fileUrl: string;
        userId: string;
        version: number;
        createdAt: string;
    };
}

export default function UploadForm({ userId, userName, email }: { userId: string | undefined, userName: string | undefined, email: string | undefined }) {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [uploadFile] = useMutation<UploadFileResponse>(CREATE_UPLOAD_FILE);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > MAX_FILE_SIZE) {
                setMessage("File size exceeds 5MB limit.");
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setMessage("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();


            if (!result.fileURL || !result.fileId || !file.name) {
                throw new Error("Invalid server response: Missing fileUrl or fileId");
            }


            if (response.ok) {
                const { data, errors } = await uploadFile({
                    variables: {
                        fileUrl: result.fileURL,
                        filename: file.name,
                        userId,
                    },
                });
                if (errors || !data?.uploadFile) {
                    throw new Error(
                        errors?.[0]?.message || "Failed to save file metadata to database"
                    );
                }

                const emailResponse = await fetch("/api/sendMail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: userName,
                        email,
                        fileUrl: result.fileURL,
                        title: "File Upload",
                        message: ""
                    }),
                });

                await emailResponse.json();

                if (!emailResponse.ok) {
                    const errorData = await emailResponse.text();
                    throw new Error(
                        `Email API Error: ${emailResponse.status} ${errorData}`
                    );
                }

                setMessage(`File uploaded successfully! File ID: ${result.fileId}`);
            }
        } catch (error) {
            setMessage("An error occurred during upload.");
            console.log(error);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col text-base md:text-xl space-y-4">
                    <span>Upload a file</span>
                    <input
                        type="file"
                        className="cursor-pointer rounded-2xl border-2 border-blue-500 p-2"
                        onChange={handleFileChange}
                    />
                </label>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 text-base md:text-xl cursor-pointer"
                >
                    {isLoading ? "Uploading..." : "Upload"}
                </button>
            </form>
            {message && (
                <p className="mt-4 text-base md:text-xl text-red-500 font-bold">
                    {message}
                </p>
            )}
        </div>
    );
}
