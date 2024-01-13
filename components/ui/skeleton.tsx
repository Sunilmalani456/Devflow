import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#18181B1A] dark:bg-[#FAFAFA1A]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
