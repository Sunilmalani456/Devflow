import Image from "next/image";
import Link from "next/link";
import RenderTag from "./RenderTag";

const hotQuestion = [
  {
    _id: "1",
    text: "gshafsh agshaghag gsjasjag jgsagas jgsjagj gasgasj agshgs",
  },
  {
    _id: "2",
    text: "gshafsh agshaghag gsjasjag jgsagas jgsjagj gasgasj agshgs",
  },
  {
    _id: "3",
    text: "gshafsh agshaghag gsjasjag jgsagas jgsjagj gasgasj agshgs",
  },
  {
    _id: "4",
    text: "gshafsh agshaghag gsjasjag jgsagas jgsjagj gasgasj agshgs",
  },
  {
    _id: "5",
    text: "gshafsh agshaghag gsjasjag jgsagas jgsjagj gasgasj agshgs",
  },
];
const popularTag = [
  {
    _id: "1",
    tag: "ReactJs",
    number: "20152+",
  },
  {
    _id: "2",
    tag: "Nodejs",
    number: "20152+",
  },
  {
    _id: "3",
    tag: "javascript",
    number: "20152+",
  },
  {
    _id: "4",
    tag: "java",
    number: "20152+",
  },
  {
    _id: "5",
    tag: "nextJs",
    number: "20152+",
  },
];

const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px]">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestion.map((item) => (
            <Link
              className="flex cursor-pointer items-center justify-between gap-7"
              href="/"
              key={item._id}
            >
              <p className="body-medium text-dark500_light700">{item.text}</p>
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
        <div className="mt-7 flex flex-col gap-4">
          {popularTag.map((item) => (
            <RenderTag
              key={item._id}
              _id={item._id}
              name={item.tag}
              totalCount={item.number}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
