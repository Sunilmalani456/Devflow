"use client";

import { GlobalSearchFilters } from "@/constant/filters";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");

  const [active, setActive] = useState(typeParams || "");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive(""); // reset active state

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item); // set active state

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: item.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-5">
      <p className="text-dark400_light900 body-medium">Type:</p>

      <div className="flex gap-3">
        {GlobalSearchFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={`light-border-2 small-medium rounded-3xl px-5 py-2 capitalize ${
              active === filter.value
                ? "bg-primary-500 text-light-900"
                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-900 dark:hover:text-primary-500"
            }`}
            onClick={() => handleTypeClick(filter.value)}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
