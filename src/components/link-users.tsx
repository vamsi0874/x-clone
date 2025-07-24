'use client'
import { useRouter } from "next/navigation";
import Image from "./Image";

const LinkUsers = ({friendRecommendations}:{friendRecommendations:any}) => {
  
    const router = useRouter();
    const handleClick = (username:string) => {
    router.push(`/${username}`)
  };

    return (
       <div className="flex flex-col gap-4">
            {friendRecommendations.map((person:{id:string,displayName:string | null,username:string, img:string | null }) => (
                   <div
                   key={person.id}
                   className="flex items-center justify-between cursor-pointer">
              
                     <div className="flex items-center gap-2"
                     onClick={()=>handleClick(person.username)}
                     >
                       <div className="relative rounded-full overflow-hidden w-10 h-10">
                         <Image
                           path={person.img || "general/noAvatar.png"}
                           alt={person.username}
                           w={100}
                           h={100}
                           tr={true}
                         />
                       </div>
                       <div className="">
                         <h1 className="text-md font-bold">{person.displayName || person.username}</h1>
                         <span className="text-textGray text-sm">@{person.username}</span>
                       </div>
                     </div>
              
                     <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">
                       Follow
                     </button>
                   </div>
                 ))}
       </div>
    )
}

export default LinkUsers