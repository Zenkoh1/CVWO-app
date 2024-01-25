import { TextField, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAPI from "../api/useAPI";
import session from "../api/sessions_manager";
import Autocomplete from "@mui/material/Autocomplete";
import FormTextField from "../components/FormTextField";
import CategoryType from "../types/Category.type";

/* This page is for posting a question */
const PostQuestionpage = () => {
  const [title, setTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(
    [],
  );

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: CategoryType[],
  ) => setSelectedCategories(value);

  const { fetchAPI: fetchQuestionsAPI } = useAPI("/api/v1/questions", {
    method: "POST",
    data: {
      question: {
        title: title,
        category_ids: selectedCategories.map((category) => category.id),
        author_id: session.getters.getUser().id,
      },
    },
    headers: {
      "content-type": "application/json",
    },
  });

  const {
    fetchAPI: fetchCategoriesAPI,
    loading: loadingCategories,
    data: dataCategories,
  } = useAPI("/api/v1/categories");

  useEffect(() => {
    fetchCategoriesAPI();
  }, []);

  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title && selectedCategories.length > 0) {
      fetchQuestionsAPI()
        .then(() => {
          //alert('Question submitted!')
          navigate("/");
        })
        .catch(() => {
          alert("Error submitting question, try logging in!");
        });
    }
  };

  return (
    <Box width="50vw" display="inline-block">
      <form autoComplete="off" onSubmit={handleSubmit}>
        <h2>Post a question</h2>
        <FormTextField input={title} setInput={setTitle} label="Question" />
        <Autocomplete
          onChange={handleChange}
          multiple
          limitTags={5}
          sx={{ mb: 3 }}
          options={
            loadingCategories ? [] : Object.values(dataCategories as JSON)
          }
          loading
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Categories" />}
          fullWidth
        />
        <Button variant="outlined" color="secondary" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default PostQuestionpage;
