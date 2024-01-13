import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Votes from "@/components/shared/Votes";
import Metric from "@/components/shared/Metric";
import RenderTag from "@/components/shared/RenderTag";
import ParseHTML from "@/components/shared/parseHTML";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs";


import Image from "next/image";
import Link from "next/link";
import React from "react";

import type { Metadata } from "next";
import { URLProps } from "@/types";

export async function generateMetadata({
  params,
}: Omit<URLProps, "searchParams">): Promise<Metadata> {
  const question = await getQuestionById({ questionId: params.id });

  return {
    title: `"${question.title}" | DevOverflow`,
  };
}

// @ts-ignore
const Page = async ({ params, searchParams }) => {
  // console.log(params);

  const { userId: clerkId } = auth();
  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
    // console.log({clerkId});
    // console.log("mongooo00000000000000 user ", mongoUser);
  }

  const result = await getQuestionById({ questionId: params.id });
  if (!result) return null;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            className="flex items-center justify-start gap-2"
            href={`/profile/${result.author.clerkId}`}
          >
            <Image
              className="rounded-full"
              src={result.author.picture}
              alt="Picture of the author"
              width={25}
              height={25}
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>

          {/* VOTES 
          // itemId={JSON.stringify(result._id)}
          // itemId={result._id}
          // userId={mongoUser._id}
          // userId={JSON.stringify(mongoUser._id)}
          */}
          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={result._id}
              userId={clerkId ? mongoUser._id : ""}
              // userId={mongoUser._id}
              upvotes={result.upvotes.length}
              hasUpVoted={clerkId ? result.upvotes.includes(mongoUser._id) : ""}
              downvotes={result.downvotes.length}
              hasDownVoted={
                clerkId ? result.downvotes.includes(mongoUser._id) : ""
              }
              hasSaved={
                clerkId ? mongoUser?.savedQuestions.includes(result._id) : ""
              }
              // hasSaved={mongoUser?.saved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      {/* METRICS */}
      <div className="mb-8 mt-4 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(result.createdAt)}`}
          title=" "
          textStyles="small-medium text-dark500_light500"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(result.answers.length)}
          title="Answer"
          textStyles="small-medium text-dark500_light500"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(result.views)}
          title="Views"
          textStyles="small-medium text-dark500_light500"
        />
      </div>

      <div>
        <ParseHTML data={result.content} />
      </div>

      <div className="mt-8 flex flex-row items-center justify-between">
        <div className="flex flex-wrap gap-4">
          {result.tags.map((tag: any) => (
            <RenderTag
              key={tag._id}
              _id={tag}
              name={tag.name}
              showCount={false}
            />
          ))}
        </div>
      </div>

      <AllAnswers
        questionId={result._id}
        userId={clerkId ? mongoUser._id : ""}
        // userId={mongoUser._id}
        totalAnswers={result.answers.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />

      <Answer
        question={result.content}
        questionId={JSON.stringify(result._id)}
        authorId={clerkId ? JSON.stringify(mongoUser._id) : ""}
        // authorId={JSON.stringify(mongoUser._id)}
      />
    </>
  );
};

export default Page;
