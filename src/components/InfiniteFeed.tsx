"use client"
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "@tanstack/react-query"
import Post, { PostWithDetails } from "./Post";


const InfiniteFeed = ({userProfileId}:{userProfileId?:string}) => {

    const fetchPosts = async (pageParam:number, userProfileId:string) => {
        const res = await fetch(
            "http://localhost:3000/api/posts?cursor=" +
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
      if(status === "pending") return "loading"
      
    
      console.log(data)
   const allPosts = data?.pages.flatMap((page) => page.posts)
   console.log(allPosts)

    
    return (
        <div>
            <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h1>Posts are loading...</h1>}
      endMessage={<h1>All posts loaded!</h1>}
    >
      {allPosts.map((post:PostWithDetails) => (
        <Post key={post.id} post={post}/>
      ))}
      </InfiniteScroll>
        </div>
    )
}

export default InfiniteFeed