// @ts-nocheck
"use client";
import Image from "next/image";
import React, { useState } from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { updateUserProfile } from "@/lib/actions/user.action";

interface Props {
  img: string;
  user: string;
}

const ProfileImg = ({ img, user }: Props) => {
  const [previewImage, setPreviewImage] = useState(img);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setPreviewImage(reader.result);
        await updateUserProfile({ clerkId: user, userPicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative rounded-full">
      <Image
        src={previewImage}
        alt="Profile Picture"
        width={140}
        height={140}
        className="h-[140px] w-[140px] rounded-full border-[3px] border-primary-500 object-cover"
      />
      <div className="absolute bottom-1 right-2 flex h-7 w-7 cursor-pointer rounded-full bg-primary-500 text-white">
        <PlusCircledIcon className="h-7 w-7 cursor-pointer" />
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default ProfileImg;
