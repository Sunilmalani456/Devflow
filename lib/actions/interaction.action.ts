"use server";

// @ts-ignore
import Question from "@/database/question.model";
import { ViewQuestionParams } from "./share.types";
import { connectToDatabase } from "../mongoose";
import Interaction from "../../database/interaction.model";
import console from "console";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();
    const { questionId, userId } = params;

    // Update view count for question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) return console.log("User Has Already viewed");

      // Create new interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
