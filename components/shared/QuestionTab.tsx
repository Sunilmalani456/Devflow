import { SearchParamsProps } from "@/types";
import QuestionCard from "./card/QuestionCard";
import { getUserQuestions } from "@/lib/actions/user.action";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({
    // @ts-ignore
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      {result?.questions.map((item: any) => (
        <QuestionCard
          key={item._id}
          _id={item._id}
          clerkId={clerkId}
          title={item.title}
          tag={item.tags}
          author={item.author}
          upvote={item.upvotes}
          answer={item.answers}
          views={item.views}
          createAt={item.createdAt}
          type="Profile"
        />
      ))}
      <div className="mb-2 mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          // @ts-ignore
          isNext={result?.isNextQuestion}
        />
      </div>
    </>
  );
};

export default QuestionTab;
