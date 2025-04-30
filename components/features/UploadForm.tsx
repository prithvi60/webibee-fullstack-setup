"use client";

import { useState } from "react";


export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);


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
            if (response.ok) {
                setMessage(`File uploaded successfully! File ID: ${result.fileId}`);
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch (error) {
            setMessage("An error occurred during upload.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col text-base md:text-xl space-y-4">
                    <span>Upload a file</span>
                    <input type="file" className="cursor-pointer rounded-2xl border-2 border-blue-500 p-2" onChange={handleFileChange} />
                </label>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 text-base md:text-xl cursor-pointer"
                >
                    {isLoading ? "Uploading..." : "Upload"}
                </button>
            </form>
            {message && <p className="mt-4 text-base md:text-xl text-red-500 font-bold">{message}</p>}
        </div>
    );
}