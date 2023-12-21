// import HomeFilters from "@/components/home/HomeFilters";
import LocalSearchbar from "@/components/shared/LocalSearchbar";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/card/QuestionCard";

import { getQuestionsByTagId } from "@/lib/actions/tags.action";
import { URLProps } from "@/types";

const Page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900 uppercase">
        {result?.tagTitle}
      </h1>
      <div className="mt-11 w-full">
        <LocalSearchbar
          route={"/"}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for Tag's Questions"
          otherClasses="flex-1"
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
              title="No Saved Tag's Questions Found"
              description="It appears that there are no saved tag's questions in your collection at the moment 😔.Start exploring and saving questions that pique your interest 🌟"
              link="/"
              linkTitle="Explore Questions"
            />
          )
        }
      </div>
    </>
  );
};

export default Page;
