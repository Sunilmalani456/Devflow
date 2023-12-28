"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";
import { connectToDatabase } from "../mongoose";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./share.types";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter } = params;

    const query: FilterQuery<typeof Question> = {}; // empty query

    if (searchQuery) {
      // if there is a search query, search for the question title and content
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 }; // sort by descending order
        break;
      case "frequent":
        sortOptions = { views: -1 }; // sort by descending order
        break;
      case "unanswered":
        query.answers = { $size: 0 }; // filter questions that have no answers
        break;
      default:   
        break;
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(sortOptions);

    return { questions };
  } catch (error) {
    console.log(error);
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create tags or get existing tags
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(`^${tag}$`, "i"),
          },
        },
        {
          $setOnInsert: { name: tag },
          $push: { questions: question._id },
        },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an intraction record for the user's question

    // increment the user's question count +5 points

    revalidatePath(path);
  } catch (err) {}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  const { questionId } = params;
  try {
    connectToDatabase();
    const questionById = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });
    return questionById;
  } catch (error) {
    console.log(error);
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  connectToDatabase();
  try {
    const { hasdownVoted, hasupVoted, path, questionId, userId } = params;

    let updateQuery = {};

    if (hasupVoted) {
      // if the user has upvoted the question, remove the user from the upvotes array
      updateQuery = {
        $pull: { upvotes: userId }, // remove the user from the upvotes array
      };
    } else if (hasdownVoted) {
      // if the user has downvoted the question, remove the user from the downvotes array and add the user to the upvotes array
      updateQuery = {
        $pull: { downvotes: userId }, // remove the user from the downvotes array
        $push: { upvotes: userId }, // add the user to the upvotes array
      };
    } else {
      // if the user has not voted the question, add the user to the upvotes array
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true, // return the updated document
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // increment author's reputation by +5 points for updating the question
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  connectToDatabase();
  try {
    const { hasdownVoted, hasupVoted, path, questionId, userId } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      // if the user has downvoted the question, remove the user from the downvotes array
      updateQuery = {
        $pull: { downvotes: userId }, // remove the user from the downvotes array
      };
    } else if (hasupVoted) {
      // if the user has upvoted the question, remove the user from the upvotes array and add the user to the downvotes array
      updateQuery = {
        $pull: { upvotes: userId }, // remove the user from the upvotes array
        $push: { downvotes: userId }, // add the user to the downvotes array
      };
    } else {
      // if the user has not voted the question, add the user to the downvotes array
      updateQuery = {
        $addToSet: { downvotes: userId }, // add the user to the downvotes array
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // increment author's reputation by +5 points for updating the question
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });

    // todo: delete all interactions related to the question
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {}
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.content = content;
    await question.save();

    revalidatePath(path);
  } catch (error) {}
}

export async function getHotQuestion() {
  try {
    connectToDatabase();

    const hotQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 }) // sort by descending order
      .limit(5);

    return hotQuestions;
  } catch (error) {
    console.log(error);
  }
}