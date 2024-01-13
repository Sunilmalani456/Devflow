/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { formUrlQuery } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

interface Props {
  isNext: boolean;
  pageNumber: number;
}

const Pagination = ({ isNext, pageNumber }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "next" ? pageNumber + 1 : pageNumber - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  if(!isNext && pageNumber === 1) return null;

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation("prev")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center border"
      >
        <ChevronLeftIcon className="dark:invert" />
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div>
        <p className="primary-gradient rounded-md px-3.5 py-2 font-medium text-light-900">
          {pageNumber}
        </p>
      </div>
      <Button
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center border"
      >
        <p className="body-medium text-dark200_light800">Next</p>
        <ChevronRightIcon className="dark:invert" />
      </Button>
    </div>
  );
};

export default Pagination;
