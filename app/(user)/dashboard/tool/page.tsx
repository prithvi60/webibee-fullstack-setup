import DefaultLayout from "@/components/layout/Layout/DefaultLayout";
import React from "react";
import UploadForm from "../../../../components/features/UploadForm";
import { auth } from "@/utils/auth";

const Page = async () => {
    const session = await auth();

    return (
        <DefaultLayout>
            <div className="flex flex-col justify-center items-center p-8 pb-20 gap-16 text-xl md:text-5xl sm:p-10 h-screen">
                <h4>Tool</h4>
                <h1 className="text-2xl mb-8">Upload File to Google Drive</h1>
                <UploadForm userId={session?.user?.id} />
            </div>
        </DefaultLayout>
    );
};

export default Page;
