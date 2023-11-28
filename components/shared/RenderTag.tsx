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
    <Link href={`/tags/${_id}`} className="flex justify-between mt-4 gap-2">
      <Badge className="subtle-medium bg-light-800 dark:bg-dark-400 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>

      {showCount && (
        <p className="samll-medium text-dark500_light700">{totalCount}</p>
      )}
    </Link>
  );
};

export default RenderTag;
