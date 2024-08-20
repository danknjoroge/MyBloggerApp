"use client"
import React, { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { BsFillPencilFill } from 'react-icons/bs'
import { AiFillDelete, AiFillLike, AiOutlineLike } from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Comment from '@/components/Comment'

const PostDetails = (ctx) => {
    const [postDetails, setPostDetails] = useState("")
    const [isLiked, setIsLiked] = useState(false)
    const [postLikes, setPostLikes] = useState(0)
    const [commentText, setCommentText] = useState("")
    const [commentorEmail, setCommentorEmail] = useState("")
    const [comments, setComments] = useState([])

    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        async function fetchComments() {
            const res = await fetch(`/api/comment/${ctx.params.id}`, { cache: 'no-store' })
            const comments = await res.json()
            setComments(comments)
        }
        fetchComments()
    }, [ctx.params.id])

    useEffect(() => {
        async function fetchPost() {
            const res = await fetch(`/api/post/${ctx.params.id}`, { cache: 'no-store' })
            const post = await res.json()
            setPostDetails(post)
            setIsLiked(post?.likes?.includes(session?.user?._id))
            setPostLikes(post?.likes?.length || 0)
        }
        fetchPost()
    }, [session, ctx.params.id])

    const handleDelete = async () => {
        try {
            const confirmModal = confirm("Are you sure you want to delete your post?")
            if (confirmModal) {
                const res = await fetch(`/api/post/${ctx.params.id}`, {
                    headers: {
                        'Authorization': `Bearer ${session?.user?.accessToken}`
                    },
                    method: "DELETE"
                })
                if (res.ok) {
                    router.push('/')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleLike = async () => {
        try {
            const res = await fetch(`/api/post/${ctx.params.id}/like`, {
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`
                },
                method: 'PUT'
            })
            if (res.ok) {
                if (isLiked) {
                    setIsLiked(false)
                    setPostLikes(prev => prev - 1)
                } else {
                    setIsLiked(true)
                    setPostLikes(prev => prev + 1)
                }
            } else {
                console.log('Error liking post:', res.statusText);
            }
        } catch (error) {
            console.log('Error liking post:', error);
        }
    }

    const handleComment = async () => {
        if (commentText?.length < 2) {
            alert("Comment must be at least 2 characters long")
            return
        }

        try {
            const body = {
                postId: ctx.params.id,
                email: commentorEmail,
                comment: commentText,
            }

            const res = await fetch(`/api/comment`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify(body)
            })

            const newComment = await res.json()

            setComments((prev) => {
                return [newComment, ...prev]
            })

            setCommentText("")
            setCommentorEmail("")
        } catch (error) {
            console.log(error)
        }
    }

    async function handleSubmit(event) {

        event.preventDefault();
        const formData = new FormData(event.target)
        try {
  
            const response = await fetch('/api/sendCommentEmail', {
                method: 'post',
                body: formData,
            });
            console.log(response)
            if (!response.ok) {
                console.log("falling over")
                throw new Error(`response status: ${response.status}`);
            }
            const responseData = await response.json();
            console.log(responseData['message'])
    
            alert('Message successfully sent');
        } catch (err) {
            console.error(err);
            alert("Error, please try resubmitting the form");
        }
    };

    return (
        <section className="max-w-screen-sm m-auto">
            <div className="container px-5 py-12 mx-auto">
                <div className="flex flex-wrap -m-12">
                    <div className="p-12 flex flex-col">
                        <h2 className="sm:text-3xl text-xl title-font font-medium text-gray-900 mt-4 mb-4 text-center">{postDetails.title}</h2>
                        <div className="flex items-center justify-center mt-4 gap-x-5 pt-4 pb-5">
                            {
                                session && postDetails?.authorId?._id.toString() === session?.user?._id.toString() && (
                                    <>
                                        <Link href={`/post/edit/${ctx.params.id}`} className="px-3 py-2 rounded-md text-primary font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300">
                                            Edit <BsFillPencilFill style={{ fontSize: "24px" }} />
                                        </Link>
                                        <button onClick={handleDelete} className="px-3 py-2 rounded-md text-primary font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300">
                                            Delete <AiFillDelete style={{ fontSize: "24px" }} />
                                        </button>
                                    </>
                                )
                            }
                        </div>
                        <span className="text-center py-2 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">{postDetails.category}</span>
                        <p className="leading-relaxed mb-8">
                            {postDetails.desc}
                        </p>
                        <div className="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
                            <span className="text-gray-400 mr-3 inline-flex items-center ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200 cursor-pointer">
                                {postLikes} {" "} {isLiked ? <AiFillLike size={16} onClick={handleLike} /> : <AiOutlineLike size={16} onClick={handleLike} />}
                            </span>
                        </div>
                    </div>
                </div>
                <h2 className='text-center'>Comment Section</h2>
                <div>
                    <input
                        onChange={(e) => setCommentorEmail(e.target.value)}
                        value={commentorEmail}
                        type='email'
                        className='w-full focus:outline-none p-2 mt-4'
                        placeholder='Your email'
                        required
                    />
                </div>
                <div>
                    <textarea
                        onChange={(e) => setCommentText(e.target.value)}
                        value={commentText}
                        className='w-full focus:outline-none p-2 mt-4'
                        placeholder='Leave your comment here...'
                        required
                    />
                </div>
                <div>
                    <button
                        onClick={handleComment}
                        className='px-6 py-2.5 rounded-md bg-primary mt-3 text-white hover:bg-blue-500 hover:text-white transition-all duration-300'
                    >
                        Comment
                    </button>
                </div>

            </div>

            <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-4 flex flex-col w-500">

                    <label htmlFor="form-name">Name </label>
                    <input id="form-name" autoComplete="name" maxLength={50} size="lg" name="name" className="text-black"/>

                    <label htmlFor="form-email"> Email:</label>
                    <input id="form-email" required autoComplete="email" maxLength={80} name="email" type="email" className="text-black"/>

                    <label htmlFor="form-message"> Message: </label>
                    <textarea id="form-message" required name="message" rows={5} className="text-black" />

                </div>
                <button className=" rounded bg-sky-400" type="submit">Send</button>
            </form>
        </section>
    )
}

export default PostDetails
