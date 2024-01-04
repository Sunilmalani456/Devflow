/* eslint-disable no-unused-vars */
"use server";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./share.types";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 7 } = params;

    // calculate the number of post to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOption = {};

    switch (filter) {
      case "new_users":
        sortOption = { joinedAt: -1 };
        break;
      case "old_users":
        sortOption = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOption = { reputation: -1 };
        break;

      default:
        break;
    }

    // @ts-ignore
    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOption);

    const totalUsers = await User.countDocuments(query);

    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    // console.log("get user by id", user);

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }
    //  delete user from database
    // and question, answer, comment from database

    // get user id from user
    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // delete question from database
    // @ts-ignore
    await Question.deleteMany({ author: user._id });

    // TODO: delete answer, answer from database

    // @ts-ignore
    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;

    // finish delete user from database
    //
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, userId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.savedQuestions.includes(questionId);

    if (isQuestionSaved) {
      // if already saved, remove from savedQuestions
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { savedQuestions: questionId },
        },
        { new: true }
      );
    } else {
      // if not saved, add to savedQuestions
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { savedQuestions: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestion(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, searchQuery, filter, page = 1, pageSize = 7 } = params;

    // FOR PAGINATION
    const skipAmount = (page - 1) * pageSize;

    // OLD QUERY CODE
    // const query: FilterQuery<typeof Question> = searchQuery
    //   ? { title: { $regex: new RegExp(searchQuery, "i") } }
    //   : {};
    // OLD QUERY CODE

    // NEW QUERY CODE
    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    // NEW QUERY CODE

    let sortOption = {};

    switch (filter) {
      case "most_recent":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "most_voted":
        sortOption = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOption = { views: -1 };
        break;
      case "most_answered":
        sortOption = { answers: -1 };
        break;

      default:
        break;
    }

    // @ts-ignore
    const user = await User.findOne({ clerkId }).populate({
      path: "savedQuestions",
      match: query,
      options: {
        sort: sortOption,
        skip: skipAmount,
        limit: pageSize + 1,
      },

      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isNext = user.savedQuestions.length > pageSize;

    const savedQuestions = user.savedQuestions;

    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    // get total questions and answers
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);
    const [answerUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);
    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    // @ts-ignore
    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 7 } = params;

    const skipAmount = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({
      author: userId,
    });

    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    const isNextQuestion = totalQuestions > skipAmount + userQuestions.length;

    return { totalQuestions, questions: userQuestions, isNextQuestion };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 7 } = params;

    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({
      author: userId,
    });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

      const isNextAnswer = totalAnswers > skipAmount + userAnswers.length;


    return { totalAnswers, answers: userAnswers, isNextAnswer };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

