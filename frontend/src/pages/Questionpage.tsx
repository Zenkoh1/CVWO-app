import {
  Button,
  CircularProgress,
  TextareaAutosize,
  Typography,
  Chip,
  Stack,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import useAPI from "../api/useAPI";
import QuestionType from "../types/Question.type";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AnswerType from "../types/Answer.type";
import Answer from "../components/Answer";
import CategoryType from "../types/Category.type";
import session from "../api/sessions_manager";
import isAuthorised from "../utils/check_authorised";

/* This page is for viewing an individual question */
const Questionpage = () => {
  const { id } = useParams();
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  const {
    fetchAPI,
    loading,
    data: question,
  } = useAPI<QuestionType>(`/api/v1/questions/${id}`);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const { isAuth } = useContext(session.SessionContext);

  const { fetchAPI: fetchAnswersAPI } = useAPI("/api/v1/answers", {
    method: "POST",
    data: {
      answer: {
        content: answer,
        question_id: id,
        author_id: session.getters.getUser().id,
      },
    },
    headers: {
      "content-type": "application/json",
    },
  });

  const { fetchAPI: fetchDeleteAPI } = useAPI(`/api/v1/questions/${id}`, {
    method: "DELETE",
  });

  useEffect(() => {
    fetchAPI();
  }, []);

  /* Get the answers for the question and sort them by date */
  useEffect(() => {
    if (question) {
      let newAnswers = Object.values(question.answers).map(
        (answer: AnswerType) => answer,
      );
      newAnswers = newAnswers?.sort((a: AnswerType, b: AnswerType) => {
        if (a.created_at && b.created_at) {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
        return 0;
      });

      setAnswers(newAnswers);
    }
  }, [question]);

  const onSubmitAnswer = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (answer) {
      fetchAnswersAPI()
        .then(() => {
          //alert('Answer submitted!')
          setAnswer("");
          fetchAPI();
        })
        .catch(() => {
          alert("Error submitting answer, try logging in!");
        });
    }
  };

  const onDeleteQuestion = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (question) {
      fetchDeleteAPI()
        .then(() => {
          //alert('Question deleted!')
          navigate("/");
        })
        .catch(() => {
          alert("Error deleting question!");
        });
    }
  };

  /* Delete an answer from React state */
  const onDeleteAnswer = (answer: AnswerType) => {
    setAnswers(answers.filter((a) => a.id !== answer.id));
  };

  if (loading)
    return (
      <Stack alignItems="center">
        <CircularProgress />
      </Stack>
    );

  return (
    <Box py={5} width="50vw" display="inline-block">
      {isAuthorised(question?.author_id, session.getters.getUser()) && (
        <Button variant="outlined" onClick={onDeleteQuestion} color="error">
          Delete
        </Button>
      )}
      <Box sx={{ m: 5 }}>
        <Stack spacing={0.5} direction="column" alignItems="start">
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar
              sx={{
                fontSize: 28,
                width: 55,
                height: 55,
                bgcolor: "secondary.main",
              }}
            >
              {question?.author.username?.at(0)}
            </Avatar>
            <Stack direction="column" alignItems="start">
              <Typography variant="h5" fontSize={22}>
                {question?.author.username}
              </Typography>
              <Typography variant="body1">
                {question?.created_at
                  ? new Date(question?.created_at).toDateString()
                  : ""}
              </Typography>
            </Stack>
          </Stack>
          <Box pl={1}>
            <Typography align="left" variant="h3">
              {question?.title}
            </Typography>
            <Stack spacing={2} direction="row" mt={2}>
              {Object.values(question?.categories as JSON).map(
                (category: CategoryType) => (
                  <Chip key={category.id} label={category.name} />
                ),
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>
      <hr />
      <TextareaAutosize
        disabled={!isAuth}
        style={{ width: 400, height: 100 }}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <div>
        <Button
          sx={{ m: 2 }}
          disabled={!isAuth}
          variant="contained"
          onClick={onSubmitAnswer}
        >
          Submit Answer
        </Button>
      </div>
      <Stack divider={<Divider orientation="horizontal" flexItem />}>
        {answers.map((answer: AnswerType) => (
          <Answer
            key={answer.id}
            answer={answer}
            onDelete={() => onDeleteAnswer(answer)}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default Questionpage;
