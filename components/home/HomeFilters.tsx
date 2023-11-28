/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import { HomePagefilter } from "@/constant/filters";
import { Button } from "../ui/button";

const HomeFilters = () => {
  const active = "recommended";
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePagefilter.map((item) => (
        <Button
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? "bg-primary-100 text-primary-500 dark:bg-dark-400 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          }`}
          key={item.value}
          onClick={() => {}}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
