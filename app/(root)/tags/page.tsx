/* eslint-disable no-unused-vars */
import Filters from "@/components/shared/Filters";
import LocalSearchbar from "@/components/shared/LocalSearchbar";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import { TagFilters } from "@/constant/filters";
import { getAllTag } from "@/lib/actions/tags.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags — DevOverflow",
};

const Tags = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllTag({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tags"
          iconPosition="right"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search by tag name ..."
          otherClasses="flex-1"
        />
        <Filters
          placeholder="Most Popular"
          filter={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-6">
        {
          // @ts-ignore
          result.tags.length > 0 ? (
            // @ts-ignore
            result.tags.map((tag) => (
              <Link
                href={`/tags/${tag._id}`}
                key={tag._id}
                className="shadow-light100_darknone"
              >
                <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                  <div className="background-light800_dark400 w-fit rounded-md px-5 py-[8px]">
                    <p className="paragraph-semibold text-dark300_light900">
                      {tag.name}
                    </p>
                  </div>
                  <p className="small-medium text-dark300_light900 mt-3.5">
                    The DevOverflow website is a great resource for asking and
                    answering questions on a wide range of programming topics.
                    It is a community of developers who are passionate about
                    programming and want to help others.
                  </p>
                  <p
                    className="small-medium text-dark400_light500 mt-3.5
                  "
                  >
                    <span className="body-semibold primary-text-gradient mr-2.5">
                      {tag.questions.length}+
                    </span>{" "}
                    Questions
                  </p>
                </article>
              </Link>
            ))
          ) : (
            <NoResult
              title="No Tags Yet ..."
              description="There is no tags yet, you can create one. 🚀"
              link="/ask-question"
              linkTitle="Ask Question"
            />
          )
        }
      </section>

      <div className="mb-2 mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          // @ts-ignore
          isNext={result?.isNext}
        />
      </div>
    </>
  );
};

export default Tags;
