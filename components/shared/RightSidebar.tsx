import Image from "next/image";
import Link from "next/link";
import RenderTag from "./RenderTag";
import { getHotQuestion } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tags.action";

// const popularTag = [
//   {
//     _id: "1",
//     tag: "ReactJs",
//     number: "20152+",
//   },
//   {
//     _id: "2",
//     tag: "Nodejs",
//     number: "20152+",
//   },
//   {
//     _id: "3",
//     tag: "javascript",
//     number: "20152+",
//   },
//   {
//     _id: "4",
//     tag: "java",
//     number: "20152+",
//   },
//   {
//     _id: "5",
//     tag: "nextJs",
//     number: "20152+",
//   },
// ];

const RightSidebar = async () => {
  const hotQuestion = await getHotQuestion();
  const popularTag = await getPopularTags();
  // console.log({ hotQuestion });
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px]">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestion?.map((item) => (
            <Link
              className="flex cursor-pointer items-center justify-between gap-7"
              href={`/question/${item._id}`}
              key={item._id}
            >
              <p className="body-medium text-dark500_light700">{item.title}</p>
              <Image
                src="/assets/icons/chevron-right.svg"
                height={20}
                width={20}
                alt="chevron icon"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col">
          {popularTag?.map((item) => (
            <RenderTag
              key={item._id}
              _id={item._id}
              name={item.name}
              totalCount={item.numberOfQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
