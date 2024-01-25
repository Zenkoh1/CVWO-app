import UserType from "./User.type";

type QuestionType = {
  id: number;
  title: string;
  author_id: number;
  author: UserType;
  created_at: string;
  answers: JSON;
  categories: JSON;
};

export default QuestionType;
