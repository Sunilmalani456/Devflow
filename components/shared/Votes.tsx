/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use client";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { viewQuestion } from "@/lib/actions/interaction.action";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "../ui/use-toast";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpVoted: boolean;
  downvotes: number;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpVoted,
  downvotes,
  hasDownVoted,
  hasSaved,
}: Props) => {
  // Path Hooks
  const { userId: clerkId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // HANDLE VOTE
  const handleVote = async (action: string) => {
    if (clerkId) {
      if (action === "upvote") {
        if (type === "Question") {
          await upvoteQuestion({
            questionId: itemId,
            userId,
            hasdownVoted: hasDownVoted,
            hasupVoted: hasUpVoted,
            path: pathname,
          });
        } else if (type === "Answer") {
          await upvoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasdownVoted: hasDownVoted,
            hasupVoted: hasUpVoted,
            path: pathname,
          });
        }

        // toast notification
        return toast({
          variant: !hasUpVoted ? "default" : "destructive",
          title: `Upvoted ⬆ ${!hasUpVoted ? "successful" : "removed"}`,
        });
      }

      if (action === "downvote") {
        if (type === "Question") {
          await downvoteQuestion({
            questionId: itemId,
            userId,
            hasdownVoted: hasDownVoted,
            hasupVoted: hasUpVoted,
            path: pathname,
          });
        } else if (type === "Answer") {
          await downvoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasdownVoted: hasDownVoted,
            hasupVoted: hasUpVoted,
            path: pathname,
          });
        }
        // TODO: toast notification
        return toast({
          variant: !hasDownVoted ? "default" : "destructive",
          title: `DownVoted ⬇ ${!hasDownVoted ? "successful" : "removed"}`,
        });
      }
    } else {
      return toast({
        title: "Please logged in",
        description: "You must be logged in to perform this action",
      });
    }
  };

  // HANDLE SAVE
  const handleSave = async () => {
    if (clerkId) {
      await toggleSaveQuestion({
        questionId: itemId,
        userId,
        path: pathname,
      });

      return toast({
        title: `Question ${
          !hasSaved ? "Saved in" : "Removed from"
        } Your collection`,
        variant: !hasSaved ? "default" : "destructive",
      });
    } else {
      return toast({
        title: "Please logged in",
        description: "You must be logged in to perform this action",
      });
    }
  };

  // UseEffect Hook
  useEffect(() => {
    viewQuestion({
      questionId: itemId,
      userId: userId || undefined,
    });
  }, [itemId, userId, pathname, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>

        {/* DOWNVOTES */}
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="downvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {/* HAS SAVED */}
      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          alt="star"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
