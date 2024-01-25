import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import QuestionType from "../types/Question.type";
import { useNavigate } from "react-router-dom";
import CategoryType from "../types/Category.type";

type QuestionProp = {
  question: QuestionType;
};

/* This component is for displaying a question on the homepage*/
const Question = ({ question }: QuestionProp) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{ m: 5, "&:hover": { cursor: "pointer" } }}
      onClick={() => navigate(`/question/${question.id}`)}
    >
      <Stack spacing={0.5} direction="column" alignItems="start">
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            {question.author.username?.at(0)}
          </Avatar>
          <Stack direction="column" alignItems="start">
            <Typography variant="h5">{question.author.username}</Typography>
            <Typography variant="caption">
              {new Date(question.created_at).toDateString()}
            </Typography>
          </Stack>
        </Stack>
        <Box pl={6.5}>
          <Typography align="left" variant="h4">
            {question.title}
          </Typography>
          <Stack spacing={2} direction="row">
            {Object.values(question?.categories as JSON).map(
              (category: CategoryType) => (
                <Chip key={category.id} label={category.name} />
              ),
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Question;
