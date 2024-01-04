/* eslint-disable tailwindcss/no-custom-classname */
import { Button } from "@/components/ui/button";
import { getUserById, getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { SignedIn, auth } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { getJoinedDate } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import AnswerTab from "@/components/shared/AnswerTab";
import QuestionTab from "@/components/shared/QuestionTab";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: Omit<URLProps, "searchParams">): Promise<Metadata> {
  const user = await getUserById({ userId: params.id });

  return {
    title: `${user.username}'s Profile | DevOverflow`,
  };
}

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();
  const userInfo = await getUserInfo({ userId: params.id });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo?.user.picture}
            alt="Profile Picture"
            width={140}
            height={140}
            className="rounded-full border-[3px] border-primary-500 object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo?.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo?.user.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {/* PORTFOLIO */}
              {userInfo?.user.protfolio && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo.user.protfolio}
                  title="Portfolio"
                />
              )}

              {/* LOCATION */}
              {userInfo?.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  // href={userInfo.user.location}
                  title={userInfo.user.location}
                />
              )}

              {/* JOINAT */}
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={`${getJoinedDate(userInfo?.user.joinedAt)}`}
              />
            </div>

            {userInfo?.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                <span className="font-medium text-primary-500">Bio: </span>
                {userInfo?.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === userInfo?.user.clerkId && (
              <Link href={"/profile/edit"}>
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] rounded-md px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      <Stats
        reputation={userInfo?.reputation}
        // @ts-ignore
        totalQuestions={userInfo?.totalQuestions}
        // @ts-ignore
        totalAnswers={userInfo?.totalAnswers}
        // @ts-ignore
        badges={userInfo?.badgeCounts}
      />

      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-2">
            <TabsTrigger value="top-posts" className="tab rounded">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab rounded">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <QuestionTab
              searchParams={searchParams}
              userId={userInfo?.user._id}
              // @ts-ignore
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <AnswerTab
              searchParams={searchParams}
              userId={userInfo?.user._id}
              // @ts-ignore
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
