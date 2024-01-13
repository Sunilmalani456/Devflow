/* eslint-disable tailwindcss/no-custom-classname */
import HomeFilters from "@/components/home/HomeFilters";
import Filters from "@/components/shared/Filters";
import LocalSearchbar from "@/components/shared/LocalSearchbar";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/card/QuestionCard";
import { Button } from "@/components/ui/button";
import { HomePagefilter } from "@/constant/filters";
import {
  getQuestions,
  getRecommendedQuestions,
} from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import Pagination from "../../../components/shared/Pagination";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | DevOverflow",
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId: clerkId } = auth();

  let result;

  if (searchParams?.filter === "recommended") {
    if (clerkId) {
      result = await getRecommendedQuestions({
        userId: clerkId,
        searchQuery: searchParams.q,
        page: searchParams.page ? +searchParams.page : 1,
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? +searchParams.page : 1,
    });
  }

  // Recommended is special casefilter

  // // @ts-ignore
  // console.log(result);

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={"/"}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for questions"
          otherClasses="flex-1"
        />
        <Filters
          filter={HomePagefilter}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {
          //  @ts-ignore
          result.questions.length > 0 ? (
            result?.questions.map((item) => (
              <QuestionCard
                key={item._id}
                _id={item._id}
                // @ts-ignore
                clerkId={clerkId}
                title={item.title}
                tag={item.tags}
                author={item.author}
                upvote={item.upvotes}
                answer={item.answers}
                views={item.views}
                createAt={item.createdAt}
              />
            ))
          ) : (
            <NoResult
              title="There are no question to show"
              description=" Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
           involved! 💡"
              link="ask-question"
              linkTitle="Ask a Question"
            />
          )
        }
      </div>
      <div className="mb-4 mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          // @ts-ignore
          isNext={result?.isNext}
        />
      </div>
    </>
  );
}
