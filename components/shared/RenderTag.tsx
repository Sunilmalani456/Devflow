/* eslint-disable tailwindcss/no-custom-classname */
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
interface Props {
  _id: string;
  name: string;
  totalCount?: string;
  showCount?: boolean;
}

const RenderTag = ({ _id, name, showCount, totalCount }: Props) => {
  return (
    <Link href={`/tags/${_id}`} className="mt-4 flex justify-between gap-2">
      <Badge className="subtle-medium text-light400_light500 rounded-md border-none bg-light-800 px-4 py-2 uppercase shadow-md dark:bg-dark-400 dark:shadow-none">
        {name}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{totalCount}</p>
      )}
    </Link>
  );
};

export default RenderTag;
