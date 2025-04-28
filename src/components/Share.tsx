'use client'
import { useActionState, useEffect, useRef, useState } from "react"
import NextImage from "next/image"
import Image from "./Image"
import ImageEditor from "./ImageEditor"
import { addPost } from "@/action"
import { useUser } from "@clerk/nextjs"


const Share = () => {

    const [media, setMedia] = useState<File | null>(null)
    const [isEditorOpen, setIsEditorOpen] = useState(false)

    const [settings, setSettings] = useState<{
        type: "original" | "wide" | "square";
        sensitive: boolean;
      }>({
        type: "original",
        sensitive: false,
      });

    
    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setMedia(file)
        }
    }

    const previewURl = media ? URL.createObjectURL(media) : null  
     
    const [state, formAction , isPending] = useActionState(addPost, {
        success: false,
        error: false,
    });

    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
      if (state.success) {
        formRef.current?.reset();
        setMedia(null);
        setSettings({ type: "original", sensitive: false });
      }
    }, [state]);
    const { user } = useUser();

    return (
      <form 
      ref={formRef}
      action={formAction} className="flex flex-col gap-4">
        <div className="flex p-4 gap-4">
            {/**Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image src={user?.imageUrl} alt="" w={100} h={100} tr={true} />
          </div>
            {/**others */}
            <div className="flex flex-col gap-4 flex-1">
              <input type="text" hidden readOnly name="imgType" value={settings.type} />
              <input type="text" hidden readOnly name="isSensitive" value={settings.sensitive ? "true" : "false"} />
            <input
                type="text"
                name="desc"
                placeholder="What is happening?!"
                className="bg-transparent outline-none placeholder:text-textGray text-xl"
                
                />
               
                {/**preview image */}
                {
                    previewURl &&
                <div className="relative rounded-xl overflow-hidden">
                     <div
              className="absolute top-2 left-2 bg-black bg-opacity-50 text-white py-1 px-4 rounded-full font-bold text-sm cursor-pointer"
              onClick={() => setIsEditorOpen(true)}
            >
              Edit
            </div>
            {
                media?.type.includes('video') && previewURl && 
                <div className="relative">
                <video src={previewURl} controls className="w-full h-full object-contain"/>
                </div>
            }
                   {media?.type.includes('image') && previewURl &&
                     <NextImage
                      src={previewURl}
                      alt="preview"
                      width={300}
                      height={300}
                      className={`w-full ${
                        settings.type === "original"
                          ? "h-full object-contain"
                          : settings.type === "square"
                          ? "aspect-square object-cover"
                          : "aspect-video object-cover"
                      }`}
                     />}
                    </div>
                }
                 {isEditorOpen && previewURl && (
                <ImageEditor
                    onClose={() => setIsEditorOpen(false)}
                    previewURL={previewURl}
                    settings={settings}
                    setSettings={setSettings}
                />
        )}
  
                <div className="flex justify-between flex-wrap items-center">
            <div className="flex gap-4 flex-wrap">

                <input type="file" onChange={handleMediaChange} name='file' className="hidden" id="file"
                accept="image/*, video/*"
                />
            <label htmlFor="file">
                <Image
                path="icons/image.svg"
                alt=""
                w={20}
                h={20}
                className="cursor-pointer"
                />
                 </label>
                <Image
                path="icons/gif.svg"
                alt=""
                w={20}
                h={20}
                className="cursor-pointer"
                />
                <Image
                path="icons/poll.svg"
                alt=""
                w={20}
                h={20}
                className="cursor-pointer"
                />
                <Image
                path="icons/emoji.svg"
                alt=""
                w={20}
                h={20}
                className="cursor-pointer"
                />
                <Image
                path="icons/schedule.svg"
                alt=""
                w={20}
                h={20}
                className="cursor-pointer"
                />
                <Image
                path="icons/location.svg"
                alt=""
                w={20}
                h={20}
                className="cursor-pointer"
            />
                    </div>
                    <button disabled={isPending} className="bg-white text-black px-4 py-2 rounded-full">
                        {isPending ? "Posting..." : "Post"}
                    </button>
                    {state.error && <span className="text-red-00" p-4>Error</span>}
                </div>
            </div>
        </div>
     </form>  
    )
}

export default Share