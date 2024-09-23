"use client";

import localFont from "next/font/local";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


// export const metadata = {
//     title: "Create Next App",
//     description: "Generated by create next app",
// };

const queryClient = new QueryClient();



export default function RootLayout({ children }) {

    return (
        <html lang="en">
            <body>
                {/* Wrap with QueryClientProvider */}
                <QueryClientProvider client={queryClient}>
                    {children}
                    <ReactQueryDevtools />
                </QueryClientProvider>
            </body>
        </html>
    );
}
