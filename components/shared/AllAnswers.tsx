import React from "react";
import Filters from "./Filters";
import { AnswerFilters } from "@/constant/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import Pagination from "./Pagination";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./parseHTML";
import Votes from "./Votes";


interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) => {
  const result = await getAnswers({
    questionId,
    page: page ? +page : 1,
    sortBy: filter,
  });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

        <Filters filter={AnswerFilters} />
      </div>

      <div>
        {result?.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.author.clerkId}`}
                className="flex flex-1 items-start gap-1 sm:items-center"
              >
                <Image
                  src={answer.author.picture}
                  alt="profile picture"
                  width={18}
                  height={18}
                  className="rounded-full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="body-semibold text-dark300_light700">
                    {answer.author.name}
                  </p>
                  <p className="small-regular text-light400_light500 ml-1 mt-0.5 line-clamp-1">
                    <span className="max-sm:hidden">•</span> answered{" "}
                    {getTimestamp(answer.createdAt)}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end">
                <Votes
                  type="Answer"
                  itemId={JSON.stringify(answer._id)}
                  userId={JSON.stringify(userId)}
                  upvotes={answer.upvotes.length}
                  hasUpVoted={answer.upvotes.includes(userId)}
                  downvotes={answer.downvotes.length}
                  hasDownVoted={answer.downvotes.includes(userId)}
                />
              </div>
            </div>

            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>

      <div className="mb-2 mt-8 w-full">
        <Pagination
          pageNumber={page ? +page : 1}
          // @ts-ignore
          isNext={result?.isNextAnswer}
        />
      </div>
    </div>
  );
};

export default AllAnswers;
