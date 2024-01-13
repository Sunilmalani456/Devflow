/* eslint-disable tailwindcss/no-custom-classname */
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import Link from "next/link";
import Metric from "../Metric";
import RenderTag from "../RenderTag";
// import Image from "next/image";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../EditDeleteAction";
import Image from "next/image";


interface Props {
  _id: string;
  title: string;
  tag: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  views: number;
  upvote: string[];
  answer: Array<object>;
  createAt: Date;
  type?: string;
  clerkId?: string;
}

const QuestionCard = ({
  clerkId,
  _id,
  title,
  tag,
  author,
  upvote,
  views,
  answer,
  createAt,
  type,
  
}: Props) => {
<<<<<<< HEAD
  const Dot = (
    <span className="text-dark400_light700 relative">
      <span className="text-dark400_light700 absolute left-0 top-[-0.3] font-extrabold">
        .
      </span>
      <span className="ml-2">{`asked ${getTimestamp(createAt)}`}</span>
    </span>
  );

=======
  // @ts-ignore
  const showActionButtons = clerkId && clerkId === author.clerkId;

 
>>>>>>> b4deca00a1c4cc6f2a6bcb30d9e5ac71f4dd1195
  return (
    <div className="card-wrapper rounded-[10px] p-9 shadow-lg sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
              {title}
            </h3>
          </Link>
        </div>

        {/* if signed in add edit delete actions */}

        <SignedIn>
          {type === "Profile" && showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>

        {/* show Saved Icon */}
        {type === "Collection" && (
          <Image
            src="/assets/icons/star-filled.svg"
            alt="star"
            width={18}
            height={18}
            className="cursor-pointer"
            // onClick={handleSave}
          />
        )}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tag.map((item) => (
          <RenderTag key={item._id} _id={item._id} name={item.name} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <div>
          <Metric
            imgUrl={author.picture}
            alt="user"
            value={author.name}
<<<<<<< HEAD
            // @ts-ignore
            title={Dot}
            href={`/profile/${author._id}`}
=======
            title={` • asked ${getTimestamp(createAt)}`}
            href={`/profile/${clerkId}`}
>>>>>>> b4deca00a1c4cc6f2a6bcb30d9e5ac71f4dd1195
            isAuthor
            textStyles="body-medium text-dark400_light700"
          />
        </div>
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatAndDivideNumber(upvote.length)}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(answer.length)}
            title="Answer"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(views)}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
