import Link from "next/link";

export const SuperAdminTable = ({
    data,
    refetch,
}: {
    data: any[];
    refetch: () => void;
}) => {
    return (
        <div className="md:w-full w-[90vw] overflow-hidden">
            <div className="w-full bg-[#FAFAFA] shadow-lg rounded-lg overflow-x-scroll xl:overflow-hidden sidebar_scroll_2">
                <table className="w-full min-w-[500px]">
                    <thead>
                        <tr className="border-b-[1px] border-slate-200 text-black text-sm uppercase font-bold">
                            <th className="text-start p-2 sm:p-4 font-medium">User Name</th>
                            <th className="text-start p-2 sm:p-4 font-medium">Email</th>
                            <th className="text-start p-2 sm:p-4 font-medium">Version</th>
                            <th className="text-start p-2 sm:p-4 font-medium">Download File</th>
                            <th className="text-start p-2 sm:p-4 font-medium">View File</th>
                        </tr>
                    </thead>

                    <tbody>
                        <TableRows data={data} />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TableRows = ({ data }: { data: any }) => {
    const lastFile = data?.UploadedFile?.[data?.UploadedFile?.length - 1];
    const fileUrl = lastFile?.fileUrl;
    const fileVersion = lastFile?.version + 1;

    const fileId = fileUrl?.split('=')[1];
    const viewUrl = fileId ? `https://drive.google.com/file/d/${fileId}/view` : "#";
    return (
        <>
            <tr className="text-xs sm:text-sm">
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        {data?.name}
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block text-xs text-slate-500">{data?.email}</span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        {fileVersion}
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <Link
                        href={fileUrl || "#"}
                        className="p-3 rounded-md bg-black text-white"
                    >
                        Download
                    </Link>
                </td>
                <td className="p-2 sm:p-4">
                    <Link
                        href={viewUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-md bg-black text-white"
                    >
                        View
                    </Link>
                </td>
            </tr>
        </>
    );
};
