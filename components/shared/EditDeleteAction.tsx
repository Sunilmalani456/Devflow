"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
    // if (type === "Question") {
    //   router.push(`/question/edit/${JSON.parse(itemId)}`);
    // } else if (type === "Answer") {
    //   router.push(`/edit-answer/${JSON.parse(itemId)}`);
    // }
  };

  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({
        questionId: JSON.parse(itemId),
        path: pathname,
        // isQuestionPath: pathname === `/question/${JSON.parse(itemId)}`,
      });
    } else if (type === "Answer") {
      await deleteAnswer({
        answerId: JSON.parse(itemId),
        path: pathname,
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={15}
          height={15}
          className="cursor-pointer"
          onClick={handleEdit}
        />
      )}

      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={15}
        height={15}
        className="cursor-pointer"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
