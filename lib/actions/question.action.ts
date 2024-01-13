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
  RecommendedParams,
} from "./share.types";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 9 } = params;

    // calculate the number of post to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

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
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await Question.countDocuments(query);

    const isNext = totalQuestions > skipAmount + questions.length;

    // For isNext ->
    // check if there is a next page by comparing the total number of (questions.length) which mean no. of questions in the current page we show and (skipAmount) which mean the number of questions we skip

    // example ->
    // 100(total questions) = 4 (pages) * 20 (skiped questions mean total 80) + 20 (questions in the current page we show mean we have on 5 page)

    // if totalQuestions is 101 then isNext is true because we have 1 more question in the next page

    return { questions, isNext };
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

    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    // increment the user's question count +5 points

    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (err) {
    console.log(err);
  }
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

    // increment author's reputation by +1/-1 points for upVoting/revoking an upvote the question
    if (userId !== question.author.toString()) {
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasupVoted ? -1 : 1 },
      });

      // increment author's reputation by +10/-10 points for recieving an upVoting/downvoting to the question from other users
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: hasupVoted ? -10 : 10 },
      });
    }

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

    // increment author's reputation by +2 points for downVoting/revoking the question

    if (userId !== question.author.toString()) {
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasdownVoted ? -2 : 2 },
      });

      //  author of the answer
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: hasdownVoted ? -10 : 10 },
      });
    }

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

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 20, searchQuery } = params;

    // find user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const skipAmount = (page - 1) * pageSize;

    // Find the user's interactions
    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    // Extract tags from user's interactions
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    // Get distinct tag IDs from user's interactions
    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
        { author: { $ne: user._id } }, // Exclude user's own questions
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    console.log(error);
  }
}
