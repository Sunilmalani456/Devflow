import Image from "next/image";
import Link from "next/link";

interface Props {
  imgUrl: string;
  title: string;
  href?: string;
}

const ProfileLink = ({ imgUrl, title, href }: Props) => {
  return (
    <div className="flex items-center justify-center gap-[6px]">
      <Image src={imgUrl} alt="icon" width={20} height={20} />

      {href ? (
        <Link
          href={href}
          target="_blank"
          className="paragraph-medium text-blue-500"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
