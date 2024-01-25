import React, { useEffect, useRef, useState } from "react";
import useAPI from "../api/useAPI";
import Question from "../components/Question";
import QuestionType from "../types/Question.type";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  TextFieldProps,
} from "@mui/material";

import { useSearchParams } from "react-router-dom";
import CategoryType from "../types/Category.type";
import SearchIcon from "@mui/icons-material/Search";
import Tune from "@mui/icons-material/Tune";
import FilterDialog from "../components/FilterDialog";

/* This is the homepage where all the questions are displayed */
const Homepage = () => {
  const {
    fetchAPI,
    loading: loadingQuestions,
    data: dataQuestions,
  } = useAPI<JSON>("/api/v1/questions");
  const {
    fetchAPI: fetchCategoriesAPI,
    loading: loadingCategories,
    data: dataCategories,
  } = useAPI("/api/v1/categories");
  const [filteredData, setFilteredData] = useState<Array<QuestionType>>();

  const [searchParams, setSearchParams] = useSearchParams();

  const [open, setOpen] = useState(false);

  const searchRef = useRef<TextFieldProps>(null);

  useEffect(() => {
    fetchAPI();
    fetchCategoriesAPI();
  }, []);

  /* Filter questions when the search parameters or the data changes*/
  useEffect(() => {
    filterQuestions();
  }, [searchParams, dataQuestions]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filterValue = searchRef.current?.value as string;
    setSearchParams((searchParams) => {
      searchParams.set("q", filterValue);
      return searchParams;
    });
  };

  /* Filter the questions based on the search and filter parameters
     Also sorts by latest post by default*/
  const filterQuestions = () => {
    let newData = [];
    const searchFilter = searchParams.has("q")
      ? (searchParams.get("q") as string)
      : "";
    if (dataQuestions) {
      newData = Object.values(dataQuestions).filter((question: QuestionType) =>
        question?.title?.includes(searchFilter),
      );
    }
    const filterValue = searchParams.has("filter")
      ? (searchParams.getAll("filter") as string[])
      : [];

    for (const filter of filterValue) {
      newData = newData?.filter((question: QuestionType) =>
        Object.values(question.categories).find(
          (category: CategoryType) => category.name === filter,
        ),
      );
    }

    newData = newData?.sort((a: QuestionType, b: QuestionType) => {
      if (a.created_at && b.created_at) {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return 0;
    });
    setFilteredData(newData);
  };

  /* Get the question components to display */
  const getQuestionComponents = (
    filteredData: Array<QuestionType> | undefined,
  ) => {
    if (filteredData === undefined || filteredData.length === 0) {
      return <Box py={2}>No results found</Box>;
    }
    return filteredData.map((question: QuestionType) => (
      <Question key={question.id} question={question} />
    ));
  };

  if (loadingQuestions || loadingCategories)
    return (
      <Stack alignItems="center">
        <CircularProgress />
      </Stack>
    );

  return (
    <Box sx={{ py: 5, px: 30 }}>
      <form onSubmit={onSubmit}>
        <TextField
          fullWidth
          inputRef={searchRef}
          InputProps={{
            sx: { borderRadius: 5 },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setOpen(true)}>
                  <Tune />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          placeholder="Search..."
          size="small"
        />
      </form>
      <Stack divider={<Divider orientation="horizontal" flexItem />}>
        {getQuestionComponents(filteredData)}
      </Stack>
      <FilterDialog
        setOpen={setOpen}
        open={open}
        onClose={() => setOpen(false)}
        categoryList={Object.values(dataCategories as JSON).map(
          (category: CategoryType) => category,
        )}
      />
    </Box>
  );
};

export default Homepage;
