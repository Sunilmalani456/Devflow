// import HomeFilters from "@/components/home/HomeFilters";
import Filters from "@/components/shared/Filters";
import LocalSearchbar from "@/components/shared/LocalSearchbar";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import QuestionCard from "@/components/shared/card/QuestionCard";
import { QuestionFilters } from "@/constant/filters";
import { getSavedQuestion } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection | DevOverflow",
};


const Page = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  console.log({ userId });

  if (!userId) return null;

  const result = await getSavedQuestion({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={"/collection"}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for questions"
          otherClasses="flex-1"
        />
        <Filters
          filter={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex"
        />
      </div>
      {/* <HomeFilters /> */}

      <div className="mt-10 flex w-full flex-col gap-6">
        {
          //  @ts-ignore
          result.questions.length > 0 ? (
            //  @ts-ignore
            result?.questions.map((item) => (
              <QuestionCard
                key={item._id}
                _id={item._id}
                title={item.title}
                tag={item.tags}
                author={item.author}
                upvote={item.upvotes}
                answer={item.answers}
                views={item.views}
                createAt={item.createdAt}
                type="Collection"
              />
            ))
          ) : (
            <NoResult
              title="No Saved Questions Found"
              description="It appears that there are no saved questions in your collection at the moment 😔.Start exploring and saving questions that pique your interest 🌟"
              link="/"
              linkTitle="Explore Questions"
            />
          )
        }
      </div>

      <div className="mb-2 mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result?.isNext}
        />
      </div>
    </>
  );
};

export default Page;
