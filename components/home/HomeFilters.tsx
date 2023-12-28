/* eslint-disable no-unused-vars */
/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import { HomePagefilter } from "@/constant/filters";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { formUrlQuery } from "@/lib/utils";

const HomeFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState("");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive(""); // reset active state

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item); // set active state

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePagefilter.map((item) => (
        <Button
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-md dark:shadow-none ${
            active === item.value
              ? "bg-primary-100 text-primary-500 dark:bg-dark-400 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          }`}
          key={item.value}
          onClick={() => handleTypeClick(item.value)}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
