import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from "query-string";
import { BADGE_CRITERIA } from "@/constant";
import { BadgeCounts } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const elapsedTimeInMilliseconds = now.getTime() - createdAt.getTime();

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (elapsedTimeInMilliseconds < minute) {
    const seconds = Math.floor(elapsedTimeInMilliseconds / 1000);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  } else if (elapsedTimeInMilliseconds < hour) {
    const minutes = Math.floor(elapsedTimeInMilliseconds / minute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (elapsedTimeInMilliseconds < day) {
    const hours = Math.floor(elapsedTimeInMilliseconds / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (elapsedTimeInMilliseconds < week) {
    const days = Math.floor(elapsedTimeInMilliseconds / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (elapsedTimeInMilliseconds < month) {
    const weeks = Math.floor(elapsedTimeInMilliseconds / week);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (elapsedTimeInMilliseconds < year) {
    const months = Math.floor(elapsedTimeInMilliseconds / month);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(elapsedTimeInMilliseconds / year);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};

export const formatAndDivideNumber = (number: number): string => {
  if (number >= 1000000) {
    // If the number is in millions (1,000,000 or more)
    const millions = (number / 1000000).toFixed(2);
    return `${millions}M`;
  } else if (number >= 1000) {
    // If the number is in thousands (1,000 or more)
    const thousands = (number / 1000).toFixed(2);
    return `${thousands}K`;
  } else {
    // If the number is less than 1,000, simply return the number as is
    return `${number}`;
  }
};

export function getJoinedDate(date: Date): string {
  // const month = date.toLocaleString("default", { month: "long" });
  // const year = date.getFullYear();

  // // Create joined date string (ex. "September 2023")
  // const joinedDate = `${month} ${year}`;
  // return joinedDate;

  const month: string = date.toLocaleString("default", { month: "long" });
  const year: number = date.getFullYear();

  return `Joined | ${month} ${year}`;
}

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}
export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    { skipNull: true }
  );
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}
export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    { skipNull: true }
  );
}

interface BadgeParam {
  criteria: { type: keyof typeof BADGE_CRITERIA; count: number }[];
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((criterion) => {
    const { type, count } = criterion;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
}; 



