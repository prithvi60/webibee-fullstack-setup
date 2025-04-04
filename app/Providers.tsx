"use client";

import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    // Create a basic client without auth for initial render
    const httpLink = new HttpLink({
        uri: "http://localhost:3000/api/graphql",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const client = new ApolloClient({
        link: httpLink,
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

    return (
        <SessionProvider>
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </SessionProvider>
    );
}