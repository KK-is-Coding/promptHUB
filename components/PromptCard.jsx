'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';



const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");


  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  }

  const handleProfileClick = () => {
    if (post.creator._id === session?.user.id) {
      return router.push("/profile");
    }

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  }


  return (
    <div className="prompt_card">
      <div className="flex justify-between gap-5 items-start flex-wrap">
        <div
          className='flex-1 flex justify-start items-center gap-3 cursor-pointer flex-wrap'
          onClick={handleProfileClick}
        >
          <Image
            src={post.creator.image}
            alt="user_image"
            className='rounded-full object-contain'
            height={40}
            width={40}
            display="block"
          />

          <div className='flex flex-col'>
            <h3 className='font-satoshi font-semibold text-gray-900'>
              {post.creator.username}
            </h3>
            <p className='text-sm font-inter text-gray-500'>
              {post.creator.email}
            </p>
          </div>
        </div>

        <div className='copy_btn' onClick={handleCopy}>
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
            height={18}
            width={18}
          />
        </div>
      </div>

      <p className='font-satoshi my-4 text-sm text-gray-700'>
        {post.prompt}
      </p>
      <p
        className='blue_gradient text-sm font-inter cursor-pointer'
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        {post.tag}
      </p>

      {session?.user.id === post.creator._id && pathName === "/profile" && (
        <div className='flex-center border-t mt-5 gap-4 border-gray-100 pt-3'>
          <p
            className='text-green-400 font-inter text-sm cursor-pointer hover:text-green-800'
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className='text-red-400 text-sm font-inter cursor-pointer hover:text-red-800'
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  )
}

export default PromptCard