/* eslint-disable no-unused-vars */
"use client";

import Image from "next/image";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface CustomInput {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeHolder: string;
  otherClasses: string;
}

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeHolder,
  otherClasses,
}: CustomInput) => {
  // Navigation Hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["q"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [route, search, pathname, router, searchParams, query]);

  return (
    <>
      <div
        className={`background-light800_darkgradient flex min-h-[56px] grow  items-center gap-4 rounded-[10px] px-4 ${otherClasses} 
        
        `}
        // {${
        //   iconPosition === "right" && "flex-row-reverse"
        // }}
      >
        {iconPosition === "left" && (
          <Image
            src={imgSrc}
            alt="seacrhIcon"
            width={28}
            height={28}
            className="cursor-pointer"
          />
        )}
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeHolder}
          className="text-dark400_light700 paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />
        {iconPosition === "right" && (
          <Image
            src="/assets/icons/search.svg"
            alt="seacrhIcon"
            width={28}
            height={28}
            className="cursor-pointer"
          />
        )}
      </div>
    </>
  );
};

export default LocalSearchbar;
