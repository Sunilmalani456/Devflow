/* eslint-disable no-unused-vars */
/* eslint-disable tailwindcss/no-custom-classname */
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  filter: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
  placeholder?: string;
}

const Filters = ({
  filter,
  placeholder = "Search a Filter",
  otherClasses,
  containerClasses,
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramFilter = searchParams.get("filter");

  const handleUpdateQuery = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={(value) => handleUpdateQuery(value)}
        //  onValueChange={handleUpdateQuery}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filter.map((item) => (
              <SelectItem
                key={item.name}
                value={item.value}
                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
