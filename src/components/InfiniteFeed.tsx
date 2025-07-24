"use client"
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "@tanstack/react-query"
import Post, { PostWithDetails } from "./Post";


const InfiniteFeed = ({userProfileId}:{userProfileId?:string}) => {

    const fetchPosts = async (pageParam:number, userProfileId:string) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/posts?cursor=` +
              pageParam +
              "&user=" +
              userProfileId
          );
        const data = await res.json()
      
        return data
    }
   
    const { data, error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: ({ pageParam=2 }) => fetchPosts(pageParam, userProfileId as string),
        initialPageParam: 2,
        getNextPageParam: (lastPage, pages) =>                      

          lastPage.hasMore ? pages.length + 2 : undefined,
      });
      
      if(error){ 
        console.log(error)
        return "something went wrong"
    }
      if(status === "pending") return (
        <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
          </div>
      )
      
    
      console.log(data)
   const allPosts = data?.pages.flatMap((page) => page.posts)
   console.log(allPosts)

    
    return (
        <div>
            <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={ 
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
          </div>
         }
      endMessage={ 
        <div className="text-center text-sm text-gray-500 py-6">
        <div className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full shadow-sm">
          All posts loaded!
        </div>
       </div>
      }
    >
      {allPosts.map((post:PostWithDetails,index:number) => (
        <Post key={index} post={post}/>
      ))}
      </InfiniteScroll>
        </div>
    )
}

export default InfiniteFeed