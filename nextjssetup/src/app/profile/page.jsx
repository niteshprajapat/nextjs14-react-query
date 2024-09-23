"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

const Profile = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Get the auth data from the query cache
    const authData = queryClient.getQueryData(['auth']);
    console.log("authDataasas", authData);



    const { mutate: deleteAccountMutation, isError, error } = useMutation({
        mutationKey: ["deleteUser"],
        mutationFn: async (id) => {
            const response = await axios.delete(`http://127.0.0.1:3000/api/user/deleteuser/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            return response.data;
        },
        onSuccess: (data) => {
            console.log("deletedata", data);
            router.push('/login');
        },
        onError: (err) => {
            console.log(err);
        }
    })


    const handleDelete = async (e) => {
        e.preventDefault();

        deleteAccountMutation(authData?.user?._id);
    }


    if (isError) {
        return <h1>{error?.message}</h1>
    }

    return (
        <div className='my-10 flex flex-col mx-auto w-[500px] gap-10'>
            {
                <div className='flex justify-around items-center'>
                    <div>
                        <h1 className='text-[20px] font-bold'>ID: {authData?.user?._id}</h1>
                        <h1 className='text-[20px] font-bold'>user: {authData?.user?.name}</h1>
                        <h1 className='text-[20px] font-bold'>Email: {authData?.user?.email}</h1>
                    </div>
                    <div className='flex flex-col gap-3'>
                        {/* <button onClick={() => navigate(`/update/${id}`)} className='bg-blue-500 p-2 rounded-md text-white'>Update Profile</button> */}
                        <button onClick={handleDelete} className='bg-red-500 p-2 rounded-md text-white'>Delete Account</button>
                    </div>
                </div>
            }

            <button className="p-3 bg-black text-white rounded-md ">
                <Link href="/" >Back to Home Page</Link>
            </button>



        </div>
    )
}

export default Profile


