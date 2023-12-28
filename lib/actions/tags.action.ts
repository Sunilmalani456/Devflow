/* eslint-disable no-unused-vars */
"use server";

import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
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

    const { searchQuery, filter } = params;
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

    const tags = await Tag.find(query).sort(sortOption);

    return { tags };
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

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

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
      },

      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;
    return { tagTitle: tag.name, questions };
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