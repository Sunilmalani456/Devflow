/* eslint-disable tailwindcss/no-custom-classname */
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: HTMLSpanElement | string;
  textStyles: string;
  href?: string;
  isAuthor?: boolean;
}
const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  textStyles,
  href,
  isAuthor,
}: MetricProps) => {
  // other components
  const metricContant = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`-mt-0.5 object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={`${textStyles} flex items-center gap-2`}>
        {value}
        <span
          className={`samll-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : ""
          }`}
        >
          <>{title}</>
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {metricContant}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{metricContant}</div>;
};

export default Metric;
