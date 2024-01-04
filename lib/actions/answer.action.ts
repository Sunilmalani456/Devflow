/* eslint-disable no-unused-vars */
"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./share.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
  connectToDatabase();
  try {
    const { author, content, path, question } = params;
    const newAnswer = await Answer.create({ author, content, question });
    // console.log({ newAnswer });

    // add the answer to question's answer array
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // increment author's reputation by +5 points for creating the answer
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer._id,
      tags: questionObject.tags,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getAnswers(params: GetAnswersParams) {
  connectToDatabase();
  try {
    const { questionId, sortBy, page = 1, pageSize = 7 } = params;

    const skipAmount = (page - 1) * pageSize;

    let sortOption = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOption = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOption = { upvotes: 1 };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
        break;
      case "old":
        sortOption = { createdAt: 1 };
        break;

      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name clerkId picture")
      .sort(sortOption)
      .skip(skipAmount)
      .limit(pageSize);

    const totalAnswer = await Answer.countDocuments({ question: questionId });

    const isNextAnswer = totalAnswer > skipAmount + answers.length;

    return { answers, isNextAnswer };
  } catch (error) {
    console.log(error);
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  connectToDatabase();
  try {
    const { hasdownVoted, hasupVoted, path, answerId, userId } = params;

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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true, // return the updated document
    });

    if (!answer) {
      throw new Error("Question not found");
    }

    // increment author's reputation by +5 points for updating the question
    if (userId !== answer.author.toString()) {
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasupVoted ? -2 : 2 },
      });

      //  author of the answer
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: hasupVoted ? -10 : 10 },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  connectToDatabase();
  try {
    const { hasdownVoted, hasupVoted, path, answerId, userId } = params;

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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Question not found");
    }

    // increment author's reputation by +5 points for updating the question
    if (userId !== answer.author.toString()) {
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasdownVoted ? -2 : 2 },
      });

      //  author of the answer
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: hasdownVoted ? -10 : 10 },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    await answer.deleteOne({ _id: answerId }); // delete the answer

    // remove the answer from the question's answer array
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );

    // delete all interactions related to the answer
    await Interaction.deleteMany({ answers: answerId });

    revalidatePath(path);
  } catch (error) {}
}

// ------------------ get answer by id ------------------

// export async function getAnswerById(params: GetAnswerByIdParams) {
//   try {
//     connectToDatabase();

//     const { answerId } = params;

//     const answer = await Answer.findById(answerId).populate(
//       "author",
//       "_id clerkId name picture"
//     );

//     return answer;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

// ------------------ edit answer ------------------ 

// export async function editAnswer(params: EditAnswerParams) {
//   try {
//     connectToDatabase();

//     const { answerId, content, path } = params;

//     const answer = await Answer.findById(answerId);

//     if (!answer) {
//       throw new Error("Answer not found");
//     }

//     answer.content = content;

//     await answer.save();

//     redirect(path);
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }