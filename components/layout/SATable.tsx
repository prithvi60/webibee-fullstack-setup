"use client";
import { useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { GET_USERS } from "@/utils/Queries";
import Loader from "../UI/Loader";
import { SuperAdminTable } from "../UI/SuperAdminTable";

export const SATable = ({ name }: { name: string }) => {
    const { data: allUsers, loading, refetch } = useQuery(GET_USERS);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const { data: session } = useSession();
    const admins = useMemo(() => {
        return allUsers?.users?.filter((val: any) => val.role === "user") || [];
    }, [allUsers]);

    useEffect(() => {
        if (name) {
            const results = admins.filter(
                (val: any) => val?.name === decodeURIComponent(name as string)
            );
            setFilteredData(results);
        } else {
            setFilteredData(admins);
        }
    }, [name, admins]);
    // console.log(filteredData[0]);
    // console.log(admins);


    return (
        <section>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <SuperAdminTable data={filteredData[0]} refetch={refetch} />
                </>
            )}
        </section>
    );
};

