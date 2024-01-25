import { useContext, useEffect, useState } from "react";
import AnswerType from "../types/Answer.type";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import useAPI from "../api/useAPI";
import session from "../api/sessions_manager";
import UpvoteInfoType from "../types/UpvoteInfo.type";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import isAuthorised from "../utils/check_authorised";
type AnswerProp = {
  answer: AnswerType;
  onDelete: () => void;
};

/* This component is for an individual answer on Questionpage.tsx*/
const Answer = ({ answer, onDelete: onDeleteParent }: AnswerProp) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(answer?.content);
  const [prevContent, setPrevContent] = useState(answer?.content);
  const [upvoteInfo, setUpvoteInfo] = useState({
    upvote_count: 0,
    is_upvoted: false,
  });
  const { isAuth } = useContext(session.SessionContext);

  const { fetchAPI: fetchEditAPI } = useAPI(`/api/v1/answers/${answer.id}`, {
    method: "PUT",
    data: { answer: { content: content } },
    headers: {
      "content-type": "application/json",
    },
  });

  const { fetchAPI: fetchDeleteAPI } = useAPI(`/api/v1/answers/${answer.id}`, {
    method: "DELETE",
  });

  const {
    fetchAPI: fetchUpvoteInfoAPI,
    loading,
    data: upvoteInfoData,
  } = useAPI<UpvoteInfoType>(`/api/v1/answers/${answer.id}/like_info`, {
    params: { user_id: session.getters.getUser().id },
  });

  const { fetchAPI: fetchUpvoteAPI } = useAPI(
    `/api/v1/answers/${answer.id}/like`,
    { method: "PUT", data: { user_id: session.getters.getUser().id } },
  );

  useEffect(() => {
    fetchUpvoteInfoAPI();
  }, []);

  /* Set initial upvote info  */
  useEffect(() => {
    if (upvoteInfoData) {
      setUpvoteInfo({
        upvote_count: upvoteInfoData?.upvote_count as number,
        is_upvoted: upvoteInfoData?.is_upvoted as boolean,
      });
    }
  }, [upvoteInfoData]);

  const onEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchEditAPI()
      .then(() => {
        //alert('Answer updated!')
        setIsEditing(false);
      })
      .catch(() => {
        alert("Error updating answer!");
      });
  };

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    fetchDeleteAPI()
      .then(() => {
        //alert('Answer deleted!')
        onDeleteParent();
      })
      .catch(() => {
        alert("Error deleting answer!");
      });
  };

  const onUpvote = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    fetchUpvoteAPI()
      .then(() => {
        if (upvoteInfo.is_upvoted) {
          setUpvoteInfo({
            upvote_count: upvoteInfo.upvote_count - 1,
            is_upvoted: false,
          });
        } else {
          setUpvoteInfo({
            upvote_count: upvoteInfo.upvote_count + 1,
            is_upvoted: true,
          });
        }
        //alert('Answer upvoted!')
      })
      .catch(() => {
        alert("Error upvoting answer, try logging in!");
      });
  };

  if (loading)
    return (
      <Stack alignItems="center">
        <CircularProgress />
      </Stack>
    );

  return (
    <Box>
      {isEditing ? (
        <form onSubmit={onEdit}>
          <Stack justifyContent="center" direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setContent(prevContent);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="outlined" type="submit">
              Save
            </Button>
          </Stack>
        </form>
      ) : (
        <>
          {isAuthorised(answer?.author_id, session.getters.getUser()) && (
            <Stack justifyContent="center" direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  setPrevContent(content);
                  setIsEditing(true);
                }}
              >
                Edit
              </Button>
              <Button variant="outlined" color="error" onClick={onDelete}>
                Delete
              </Button>
            </Stack>
          )}
        </>
      )}
      <Box sx={{ m: 1 }}>
        <Stack spacing={0.5} direction="column" alignItems="start">
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              {answer.author.username?.at(0)}
            </Avatar>
            <Stack direction="column" alignItems="start">
              <Typography variant="subtitle1">
                {answer.author.username}
              </Typography>
              <Typography variant="caption">
                {new Date(answer.created_at).toDateString()}
              </Typography>
            </Stack>
          </Stack>
          <Box pl={6.5}>
            {isEditing ? (
              <TextareaAutosize
                minRows={3}
                onChange={(e) => setContent(e.currentTarget.value)}
                value={content}
              />
            ) : (
              <Typography align="left" variant="h5">
                {content}
              </Typography>
            )}
          </Box>
          <Stack direction="row" alignItems="center">
            <Button disabled={!isAuth} onClick={onUpvote}>
              {upvoteInfo.is_upvoted ? (
                <Favorite color="warning" />
              ) : (
                <FavoriteBorder color="warning" />
              )}
            </Button>
            <Typography variant="body1">
              {upvoteInfo?.upvote_count} Like
              {upvoteInfo?.upvote_count !== 1 ? "s" : ""}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Answer;
