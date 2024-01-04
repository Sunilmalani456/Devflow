// import { IUser } from "@/mongodb";
// import { Schema } from "mongoose";

import { IUser } from "@/database/user.model";
import { Schema } from "mongoose";

export interface CreateAnswerParams {
  content: string;
  author: string; // User ID
  question: string; // Question ID
  path: string;
}
export interface GetAnswersParams {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}
export interface AnswerVoteParams {
  answerId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}
export interface DeleteAnswerParams {
  answerId: string;
  path: string;
}
export interface SearchParams {
  query?: string | null;
  type?: string | null;
}
export interface RecommendedParams {
  userId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}
export interface ViewQuestionParams {
  questionId: string;
  userId: string | undefined;
}
export interface JobFilterParams {
  query: string;
  page: string;
}
export interface GetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}
export interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
  author: Schema.Types.ObjectId | IUser;
  path: string;
}
export interface GetQuestionByIdParams {
  questionId: string;
}
export interface QuestionVoteParams {
  questionId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}
export interface DeleteQuestionParams {
  questionId: string;
  path: string;
}
export interface EditQuestionParams {
  questionId: string;
  title: string;
  content: string;
  path: string;
}
export interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}
export interface GetQuestionsByTagIdParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}
export interface GetTopInteractedTagsParams {
  userId: string;
  limit?: number;
}
export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;

  email: string;
  picture: string;
}
export interface GetUserByIdParams {
  userId: string;
}
export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
  // Add searchQuery parameter
}
export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}
export interface ToggleSaveQuestionParams {
  userId: string;
  questionId: string;
  path: string;
}
export interface GetSavedQuestionsParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}
export interface GetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}
export interface DeleteUserParams {
  clerkId: string;
}

export interface GetTagByIdParams {
  tagId: string;
}

// MY NEW CODE STARTS HERE
//  
// 
// 
// import { Schema } from "mongoose";

// import { IUser } from "@/database/user.model";

// /**
//  * Common interfaces used in actions
//  */
// interface ClerkId {
//   clerkId: string;
// }

// interface UserId {
//   userId: string;
// }

// interface QuestionId {
//   questionId: string;
// }

// interface AnswerId {
//   answerId: string;
// }

// interface OptionalPage {
//   page?: number;
// }

// interface OptionalPageSize {
//   pageSize?: number;
// }

// interface OptionalSearch {
//   searchQuery?: string;
// }

// interface OptionalFilter {
//   filter?: string;
// }

// interface Path {
//   path: string;
// }

// interface Content {
//   content: string;
// }

// interface Voting {
//   hasupVoted: boolean;
//   hasdownVoted: boolean;
// }

// interface Searchable
//   extends OptionalPage,
//     OptionalPageSize,
//     OptionalSearch,
//     OptionalFilter {}

// /**
//  * Interfaces for user actions
//  */
// export interface CreateUserParams extends ClerkId {
//   name: string;
//   username: string;
//   email: string;
//   picture: string;
// }

// export interface GetUserByIdParams extends UserId {}

// export interface GetAllUsersParams extends Searchable {}

// export interface GetJobsParams extends Searchable {
//   location?: string;
//   remote?: boolean | string;
//   wage?: boolean | string;
//   skills?: boolean | string;
// }

// export interface UpdateUserParams extends ClerkId, Path {
//   updateData: Partial<IUser>;
// }

// export interface DeleteUserParams extends ClerkId {}

// export interface GetUserStatsParams
//   extends UserId,
//     OptionalPage,
//     OptionalPageSize {}

// export interface ToggleSaveQuestionParams extends UserId, QuestionId, Path {}

// export interface GetSavedQuestionParams
//   extends ClerkId,
//     OptionalPage,
//     OptionalPageSize,
//     OptionalSearch,
//     OptionalFilter {}

// /**
//  * Interfaces for question actions
//  */
// export interface GetQuestionsParams extends Searchable {}

// export interface CreateQuestionParams extends Path, Content {
//   title: string;
//   tags: string[];
//   author: Schema.Types.ObjectId | IUser;
// }

// export interface GetQuestionByIdParams extends QuestionId {}

// export interface QuestionVoteParams extends QuestionId, UserId, Path, Voting {}

// export interface DeleteQuestionParams extends QuestionId, Path {
//   isQuestionPath?: boolean;
// }

// export interface EditQuestionParams extends QuestionId, Path, Content {
//   title: string;
//   tags?: string[];
// }

// /**
//  * Interfaces for answer actions
//  */
// export interface CreateAnswerParams extends Path, Content {
//   author: string;
//   question: string;
// }

// export interface GetAnswersParams
//   extends OptionalPage,
//     OptionalPageSize,
//     QuestionId {
//   sortBy?: string;
// }

// export interface GetAnswerByIdParams extends AnswerId {}

// export interface AnswerVoteParams extends AnswerId, UserId, Path, Voting {}

// export interface DeleteAnswerParams extends Path, AnswerId {}

// export interface EditAnswerParams extends Path, AnswerId, Content {}

// /**
//  * Interfaces for interaction actions
//  */
// export interface ViewQuestionParams extends UserId, QuestionId {}

// /**
//  * Interfaces for tag actions
//  */
// export interface GetTopInteractedTagsParams extends UserId {
//   limit?: number;
// }

// export interface GetAllTagsParams extends Searchable {}

// export interface GetQuestionByTagIdParams
//   extends OptionalPage,
//     OptionalPageSize,
//     OptionalSearch {
//   tagId: string;
// }

// export interface GetTagByIdParams {
//   tagId: string;
// }

// /**
//  *
//  */
// export interface SearchParams {
//   query?: string | null;
//   type?: string | null;
// }

// export interface RecommendedParams
//   extends UserId,
//     OptionalPage,
//     OptionalPageSize,
//     OptionalSearch {}

// export interface JobFilterParams {
//   query: string;
//   page: string;
// }

// export interface GetFormattedSalaryParams {
//   min: number;
//   max: number;
//   currency: string;
//   period: string;
// }