import { SearchParamsProps } from "@/types";
import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "./card/AnswerCard.tsx";
import Pagination from "./Pagination";


interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const AnswerTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    // @ts-ignore
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      {result?.answers.map((answer: any) => (
        <AnswerCard
          key={answer._id}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}

      <div className="mb-2 mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          // @ts-ignore
          isNext={result?.isNextAnswer}
        />
      </div>
    </>
  );
};

export default AnswerTab;
