import UserType from "./User.type";

type AnswerType = {
  id: number;
  author_id: number;
  author: UserType;
  question_id: number;
  content: string;
  created_at: string;
};

export default AnswerType;
