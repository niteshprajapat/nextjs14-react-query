

import { LayoutRouter } from "next/dist/server/app-render/entry-base";
import Image from "next/image";
import Link from "next/link";
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import RootLayout from "./layout";

// const queryClient = new QueryClient();

export default function Home() {
    return (
        <div className="flex flex-col justify-center items-center h-screen gap-10">

            <button className="p-3 bg-black text-white rounded-md ">
                <Link href="/profile" >Go to Profile Page</Link>
            </button>

            <button className="p-3 bg-black text-white rounded-md ">
                <Link href="/todos" >Go to Todos Page</Link>
            </button>

            {/* <LayoutRouter /> */}
            {/* <QueryClientProvider client={queryClient}>

                <ReactQueryDevtools />
            </QueryClientProvider> */}
        </div>
    );
}
