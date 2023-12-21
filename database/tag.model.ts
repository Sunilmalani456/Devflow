import { Schema, model, models, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  describtion: string; // add new field/Property
  questions: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdOn: Date;
}

const TagSchema = new Schema({
  name: { type: String, required: true, unique: true },
  describtion: {
    type: String,
    required: true,
    default:
      "JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS",
  },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdOn: { type: Date, default: Date.now },
});

const Tag = models.Tag || model("Tag", TagSchema);

export default Tag;
