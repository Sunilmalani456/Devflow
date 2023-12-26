/* eslint-disable no-unused-vars */
/* eslint-disable tailwindcss/no-custom-classname */
import { Badge } from "@/components/ui/badge";
import { getTopInteractedTags } from "@/lib/actions/tags.action";

import Image from "next/image";
import Link from "next/link";
import RenderTag from "../RenderTag";

interface Props {
  clerkId: string;
  name: string;
  username: string;
  picture: string;
  _id: string;
}
// @ts-ignore
const UserCard = async ({ user }: Props) => {
  const InteractedTags = await getTopInteractedTags({ userId: user._id });
  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone max-xs:minw-full w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt="User Profile Picture"
          width={100}
          height={100}
          className="rounded-full border-[2.5px] border-primary-500"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark100_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            <span className="mr-[3px]">@</span>
            {user.username}
          </p>
        </div>
        <div className="mt-5">
          {
            // @ts-ignore
            InteractedTags?.length > 0 ? (
              <div className="flex items-center gap-2">
                {
                  // @ts-ignore
                  InteractedTags.map((tag: any) => (
                    <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
                  ))
                }
              </div>
            ) : (
              <Badge>No tags Yet</Badge>
            )
          }
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
