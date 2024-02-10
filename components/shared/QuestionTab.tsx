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

  // const tages = result?.questions.flat().map((item: any) => item._id);

  // id [
  //   new ObjectId('65a2ca2bd9db99a735745dc6'),
  //   new ObjectId('6596e4c9c824424c4c3607d2'),
  //   new ObjectId('65a3ad8e7ecc0881f0e4e293'),
  //   new ObjectId('65b14553fbb56201a2c7dce9')
  // ]
  // result?.questions [
  //   new ObjectId('65a3ae9002bae3515e55c6b2'),
  //   new ObjectId('65a2ca2bd9db99a735745dc6'),
  //   new ObjectId('6596e4c9c824424c4c3607d2')
  // ]

  // @ts-ignore
  // console.log("result?.questions", tages);
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
