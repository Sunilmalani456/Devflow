/* eslint-disable no-unused-vars */
"use server";

import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTagByIdParams,
  GetTopInteractedTagsParams,
} from "./share.types";
import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

export async function getAllTag(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOption = {};

    switch (filter) {
      case "popular":
        sortOption = { questions: -1 };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
        break;
      case "name":
        sortOption = { name: 1 };
        break;
      case "old":
        sortOption = { createdAt: 1 };
        break;

      default:
        break;
    }

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOption);

    const totalTags = await Tag.countDocuments(query);

    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
  }
}

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Find top interactions from user and group by tags
    // Interactions...
    return [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
      { _id: "3", name: "tag3" },
    ];
  } catch (error) {
    console.log(error);
  }
}

// ------------------ Original code ------------------
// export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
//   try {
//     connectToDatabase();

//     const { userId, limit = 3 } = params;

//     const user = await User.findById(userId);

//     if (!user) throw new Error("User not found");

//     // find interactions for the user and groups by tags
//     const interactions = await Question.aggregate([
//       { $match: { author: userId } },
//       { $unwind: "$tags" },
//       { $group: { _id: "$tags", count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: limit },
//     ]);

//     // find the tags from the interactions
//     const tags = await Tag.find({
//       _id: { $in: interactions.map((i) => i._id) },
//     });

//     return tags;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    const { tagId, page = 1, pageSize = 7, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    // @ts-ignore
    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1, // +1 to check if there is next page
      },

      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const isNext = tag.questions.length > pageSize;

    const questions = tag.questions;
    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.log(error);
  }
}

export async function getTagById(params: GetTagByIdParams) {
  try {
    connectToDatabase();

    const { tagId } = params;

    const tag = await Tag.findOne({
      _id: tagId,
    });

    return tag;
  } catch (error) {
    console.log(error);
  }
}