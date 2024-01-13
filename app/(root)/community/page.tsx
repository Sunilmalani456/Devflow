import Filters from "@/components/shared/Filters";
import LocalSearchbar from "@/components/shared/LocalSearchbar";
import UserCard from "@/components/shared/userCard/userCard";
import { UserFilters } from "@/constant/filters";
import { SearchParamsProps } from "@/types";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";
import Pagination from "@/components/shared/Pagination";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | DevOverflow",
};

const Community = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/community"
          iconPosition="right"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for amazing people here ..."
          otherClasses="flex-1"
        />
        <Filters
          placeholder="Highest Reputation"
          filter={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-10 flex flex-col flex-wrap gap-6 sm:flex-row">
        {result.users.length > 0 ? (
          // @ts-ignore
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <>
            <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
              <p>No Users Yet ...</p>
              <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
                Join to be the first ...
              </Link>
            </div>
          </>
        )}
      </section>
      <div className="mb-2 mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result?.isNext}
        />
      </div>
    </>
  );
};

export default Community;
