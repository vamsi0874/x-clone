"use client"

import { followUser } from "@/action"
import { useOptimistic, useState } from "react"

const FollowButton = ({userId,isFollowed}:{userId:string,isFollowed:boolean}) => {

    const [state, setState] = useState(isFollowed);

    const [optimisticFollow, switchOptimisticFollow] = useOptimistic(
        state,
        (prev) => !prev
      );

   const handleFollow = async () => {
    switchOptimisticFollow("");
      await followUser(userId)
      setState((prev) => !prev);

   }



    return (
        <form action={handleFollow} className="flex items-center gap-2">
        <button className="bg-white text-black font-bold py-2 px-4 rounded-full">
            {optimisticFollow ? "Unfollow" : "Follow"}
        </button>
        </form>
    )
}

export default FollowButton