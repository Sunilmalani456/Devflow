import Question from "@/components/forms/question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return redirect("/sign-in");

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
