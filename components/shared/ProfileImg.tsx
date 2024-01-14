// // @ts-nocheck
// "use client";
// import Image from "next/image";
// import React, { useRef, useState } from "react";
// import { PlusCircledIcon } from "@radix-ui/react-icons";
// import { updateUserProfile } from "@/lib/actions/user.action";
// import { toast } from "../ui/use-toast";

// interface Props {
//   img: string;
//   user: string;
// }

const ProfileImg = () => {
  // const ProfileImg = ({ img, user }: Props) => {
  //   const [previewImage, setPreviewImage] = useState(img);
  //   const fileInputRef = useRef(null);

  //   const handleImageChange = async (event) => {
  //     const file = event.target.files[0];

  //     const maxFileSize = 2 * 1024 * 1024;
  //     if (file) {
  //       console.log(file.size);
  //       if (file.size < maxFileSize) {
  //         const reader = new FileReader();
  //         reader.onloadend = async () => {
  //           setPreviewImage(reader.result);
  //           await updateUserProfile({
  //             clerkId: user,
  //             userPicture: reader.result,
  //           });
  //         };
  //         reader.readAsDataURL(file);
  //       } else {
  //         console.log("Image size must be less than or equal to 2 MB");
  //         if (fileInputRef.current) {
  //           fileInputRef.current.value = "";
  //         }
  //         return toast({
  //           title: "Image Size",
  //           description: "Image size must be less than or equal to 2 MB",
  //         });
  //       }
  //     }
  //   };

  return <div>hello world</div>;
  //     <div className="relative rounded-full">
  //       <Image
  //         src={previewImage}
  //         alt="Profile Picture"
  //         width={140}
  //         height={140}
  //         className="h-[140px] w-[140px] rounded-full border-[3px] border-primary-500 object-cover"
  //       />
  //       <div className="absolute bottom-1 right-2 flex h-7 w-7 cursor-pointer rounded-full bg-primary-500 text-white">
  //         <PlusCircledIcon className="h-7 w-7 cursor-pointer" />
  //         <input
  //           type="file"
  //           accept="image/*"
  //           ref={fileInputRef}
  //           className="absolute inset-0 cursor-pointer opacity-0"
  //           onChange={handleImageChange}
  //         />
  //       </div>
  //     </div>
};

export default ProfileImg;
