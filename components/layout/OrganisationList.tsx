"use client";
import React, { useEffect, useState } from "react";

interface FileInfo {
    id: string;
    name: string;
    url: string;
    mimeType: string;
}

const OrganisationList = () => {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const handleFetchFiles = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/files");
                const result = await response.json();
                if (response.ok) {
                    setFiles(result.files);
                }
            } catch (error) {
                console.error("Error fetching files:", error);
            } finally {
                setLoading(false);
            }
        };
        handleFetchFiles();
    }, []);

    return (
        <div className="block space-y-5 md:space-y-10">
            {loading ? (
                <div className="flex justify-center items-center h-full animate-pulse text-xl text-green-400">
                    Loading...
                </div>
            ) : (
                <>
                    {files.length > 0 ? (
                        <div className="w-full max-w-2xl space-y-4">
                            <h2 className="text-xl">Uploaded Files</h2>
                            <ul>
                                {files.map((file) => (
                                    <li key={file.id} className="">
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-base md:text-lg font-semibold"
                                        >
                                            {file.name}
                                        </a>{" "}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-base md:text-lg font-semibold opacity-80">
                            No list Available...
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default OrganisationList;
