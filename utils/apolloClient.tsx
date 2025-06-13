// lib/useAuthApollo.ts
"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { User } from "next-auth";

interface CustomUser extends User {
    accessToken?: string;
}

const getGraphqlUri = () => {
    return process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/graphql"
        : "https://mvpdemo.webibee.com/api/graphql";
};

export const useAuthApollo = () => {
    const { data: session } = useSession();

    return useMemo(() => {
        const httpLink = new HttpLink({
            uri: getGraphqlUri(),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const authLink = setContext(
            (_: unknown, { headers }: { headers?: Record<string, string> }) => {
                try {
                    const token = (session?.user as CustomUser)?.accessToken;

                    if (!token) {
                        console.warn(
                            "No access token found. Sending request without token."
                        );
                        return { headers };
                    }

                    return {
                        headers: {
                            ...headers,
                            authorization: `Bearer ${token}`,
                        },
                    };
                } catch (error) {
                    console.error("Error adding auth header:", error);
                    return { headers };
                }
            }
        );

        return new ApolloClient({
            link: ApolloLink.from([authLink, httpLink]),
            cache: new InMemoryCache(),
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: "network-only",
                },
                query: {
                    fetchPolicy: "network-only",
                    errorPolicy: "all",
                },
            },
        });
    }, [session]);
};
