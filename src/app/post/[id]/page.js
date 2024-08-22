"use client"
import React, { useEffect, useState,useRef  } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { BsFillPencilFill } from 'react-icons/bs'
import { AiFillDelete, AiFillLike, AiOutlineLike } from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import styles from './post.module.css'
import DOMPurify from "dompurify";

const PostDetails = (ctx) => {
    const [postDetails, setPostDetails] = useState("")
    const [isLiked, setIsLiked] = useState(false)
    const [postLikes, setPostLikes] = useState(0)
    const [nameValid, setNameValid] = useState(null)
    const [emailValid, setEmailValid] = useState(null)
    const [messageValid, setMessageValid] = useState(null)

    const { data: session } = useSession()
    const router = useRouter()
    const formRef = useRef(null);

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
                // headers: {
                //     'Authorization': `Bearer ${session?.user?.accessToken}`
                // },
                method: 'PUT'
            })
            if (res.ok) {
                if (isLiked) {
                    setIsLiked(false)
                    setPostLikes(prev => prev + 1)
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

    const validateName = (name) => {
        setNameValid(name.trim().length > 0);
    };

    const validateEmail = (email) => {
        setEmailValid(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email));
    };

    const validateMessage = (message) => {
        setMessageValid(message.trim().length > 0);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target)
        try {
            const response = await fetch('/api/sendCommentEmail', {
                method: 'post',
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`response status: ${response.status}`);
            }
            toast.success('Message successfully sent');
            formRef.current.reset();
        } catch (err) {
            console.error(err);
            toast.error("Error, please try resubmitting the form");
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
                        <div className={` ${styles.text} leading-relaxed mb-8`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(postDetails.desc) }}></div>
                        <div className="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
                            <span className="text-gray-400 mr-3 inline-flex items-center ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200 cursor-pointer">
                                {postLikes} {" "} {isLiked ? <AiFillLike size={16} onClick={handleLike} /> : <AiOutlineLike size={16} onClick={handleLike} />}
                            </span>
                        </div>
                    </div>
                </div>
                <h2 className='font-bold text-center text-xl'>Add Comment</h2>
                <form ref={formRef} onSubmit={handleSubmit} className="mt-8 mb-2 w-full">
                    <div className="mb-4 flex flex-col w-500">
                        <input 
                            id="form-blogname" 
                            type="hidden" 
                            autoComplete="blogname" 
                            maxLength={50} 
                            size="lg" 
                            name="blogname" 
                            className="text-black" 
                            value={postDetails.title}
                        />

                        <input 
                            id="form-name" 
                            autoComplete="name" 
                            maxLength={50} 
                            size="lg" 
                            name="name" 
                            className={`w-full focus:outline-none p-2 mt-4 border-2 rounded-md ${
                                nameValid === null
                                    ? 'border-gray-300'
                                    : nameValid
                                    ? 'border-green-500'
                                    : 'border-red-500'
                            }`} 
                            placeholder='Your Name'
                            onChange={(e) => validateName(e.target.value)}
                        />
                        <input 
                            id="form-email" 
                            required 
                            autoComplete="email" 
                            maxLength={80} 
                            name="email" 
                            type="email" 
                            placeholder='Your email' 
                            className={`w-full focus:outline-none p-2 mt-4 border-2 rounded-md ${
                                emailValid === null
                                    ? 'border-gray-300'
                                    : emailValid
                                    ? 'border-green-500'
                                    : 'border-red-500'
                            }`} 
                            onChange={(e) => validateEmail(e.target.value)}
                        />
                        <textarea 
                            id="form-message" 
                            required 
                            name="message" 
                            rows={5} 
                            placeholder='Leave Your Comment Here...' 
                            className={`w-full focus:outline-none p-2 mt-4 border-2 rounded-md ${
                                messageValid === null
                                    ? 'border-gray-300'
                                    : messageValid
                                    ? 'border-green-500'
                                    : 'border-red-500'
                            }`}
                            onChange={(e) => validateMessage(e.target.value)}
                        />
                    </div>
                    <button 
                        className='px-6 py-2.5 rounded-md bg-primary mt-3 text-white hover:bg-blue-500 hover:text-white transition-all duration-300'
                        type="submit"
                    >
                        Comment
                    </button>
                </form>
            </div>
        </section>
    )
}

export default PostDetails
