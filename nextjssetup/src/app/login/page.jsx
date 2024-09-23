"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useState } from 'react';

const Login = () => {
    const queryClient = useQueryClient();

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const { mutate: loginMutation, isError, error } = useMutation({
        mutationKey: ["login"],
        mutationFn: async (loginData) => {
            try {
                const response = await axios.post('http://127.0.0.1:3000/api/user/login', loginData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                return response.data;
            } catch (error) {
                console.log(error);
            }
        },
        onSuccess: (data) => {
            console.log("loginData", data);




            queryClient.setQueryData(['auth'], {
                token: data?.token,
                user: data?.user,
            });


            router.push('/');



        },
        onError: (error) => {
            console.log(error);
        }
    })



    const handleSubmit = async (e) => {
        e.preventDefault();

        loginMutation({ email, password });

        setEmail("");
        setPassword("");
    }



    if (isError) {
        return <h1>{error.message}</h1>
    }

    return (
        <div div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8" >
            <div className="mx-auto max-w-lg text-center">
                <h1 className="text-2xl font-bold sm:text-3xl">Login</h1>


            </div>

            <form
                onSubmit={handleSubmit}
                className="mx-auto mb-0 mt-8 max-w-md space-y-4">

                <div>
                    <label htmlFor="email" className="sr-only">Email</label>

                    <div className="relative">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Enter email"
                        />

                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="sr-only">Password</label>

                    <div className="relative">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Enter password"
                        />


                    </div>
                </div>

                <button
                    type="submit"
                    className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                >
                    Login
                </button>
            </form>
        </div >
    )
}

export default Login;