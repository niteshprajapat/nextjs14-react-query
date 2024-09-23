"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link';
import React from 'react'
import { useState } from 'react';

const Todos = () => {
    const queryClient = useQueryClient();
    const authData = queryClient.getQueryData(['auth']);
    console.log("todosauth", authData);


    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingTodoId, setEditingTodoId] = useState(null);

    const { data: todos, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["todos"],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:3000/api/todo/getalltodos', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authData?.token,
                },
                withCredentials: true,
            });

            return response.data;
        },
        staleTime: 60 * 1000,
        cacheTime: 5 * 60 * 1000,
    });


    const { mutate: addTodoMutation } = useMutation({
        mutationKey: ["addTodo"],
        mutationFn: async (todoData) => {
            const response = await axios.post('http://127.0.0.1:3000/api/todo/createtodo', todoData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authData?.token,
                },
                withCredentials: true,
            });

            return response.data;
        },
        onSuccess: (data) => {
            console.log("todoadddata", data);
            setTitle("");
            setDescription("");
            refetch()
        },
        onError: (error) => {
            console.log(error);
        }
    })

    const { mutate: updateTodoMutation } = useMutation({
        mutationKey: ["updateTodo"],
        mutationFn: async (id, todoData) => {
            const response = await axios.patch(`http://127.0.0.1:3000/api/todo/updatetodo/${id}`, todoData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authData?.token,
                },
                withCredentials: true,
            });

            return response.data;
        },
        onSuccess: (data) => {
            console.log("todoadddata", data);
            setTitle("");
            setDescription("");
            refetch()
        },
        onError: (error) => {
            console.log(error);
        }
    })


    const { mutate: deleteTodoMutation } = useMutation({
        mutationFn: (todoId) => {
            return axios.delete(`http://127.0.0.1:3000/api/todo/deletetodo/${todoId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + authData?.token,
                },
                withCredentials: true,
            });
        },
        onSuccess: (data) => {
            console.log("Todo deleted", data);
            refetch();
        },
        onError: (error) => {
            console.log(error);
        }
    });

    // Deletion handler
    const handleDeleteTodo = (todoId) => {
        deleteTodoMutation(todoId);
    };



    // const handleAddTodo = async (e) => {
    //     e.preventDefault();
    //     addTodoMutation({ title, description })
    // }

    const handleUpdateTodo = async (todo) => {
        setEditingTodoId(todo._id);
        setTitle(todo.title);
        setDescription(todo.description);

        // updateTodoMutation(todo?._id, { title, description })
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingTodoId) {
            updateTodoMutation({ id: editingTodoId }, { title, description })
        } else {
            addTodoMutation({ title, description })
        }
    }



    if (isLoading) {
        return <h1>....loading</h1>;
    }

    if (isError) {
        return <h1>{error?.message}</h1>;
    }

    return (
        <div className='bg-black/90 h-full w-full flex flex-col '>
            {/* <button onClick={refetch}>Fetch Todos</button> */}


            <div className='py-5 mx-auto'>
                <form
                    onSubmit={handleSubmit}
                    className='flex  items-center gap-5'
                >
                    <div>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            placeholder='Title'
                            className='p-2 rounded-sm font-semibold'
                        />
                    </div>
                    <div>

                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            type="text"
                            placeholder='description'
                            className='p-2 rounded-sm font-semibold'
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        {/* <button onClick={handleAddTodo} className='p-2 m-2 text-white bg-black rounded-md w-fit text-center'>Add Todo</button> */}
                        <button type="submit" className='p-2 m-2 text-white bg-black rounded-md w-fit text-center'>Submit</button>
                        <button className='p-2 m-2 text-white bg-black rounded-md w-fit text-center'>
                            <Link href={"/"}>Homepage</Link>
                        </button>
                    </div>
                </form>
            </div>

            {todos && todos?.map((todo) => (
                <div key={todo._id}>
                    <div className='bg-black/80 text-white p-2 m-5 rounded-md flex justify-between items-center px-10'>
                        <Link href={`/todos/${todo?._id}`}>
                            <h1>title: {todo?.title}</h1>
                            <span>description: {todo?.description}</span>
                        </Link>
                        <div className='flex items-center gap-6'>
                            <button onClick={() => handleDeleteTodo(todo?._id)}>❌</button>
                            <button onClick={() => handleUpdateTodo(todo)}>🖊</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Todos