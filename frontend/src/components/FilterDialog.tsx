import { Button, Chip, Dialog, DialogTitle, Grid } from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryType from "../types/Category.type";
type FilterDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categoryList: CategoryType[];
  onClose?: () => void;
};

/* This component is for displaying a dialog for filtering questions by category  on the homepage*/
const FilterDialog = ({
  open,
  categoryList,
  setOpen,
  onClose,
}: FilterDialogProps) => {
  const [selected, setSelected] = useState<Array<boolean>>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  /* Add selected categories to 'selected' array*/
  const onClick = (category: CategoryType) => {
    const id = category.id;
    setSelected((selected) => {
      const newSelected = [...selected];
      if (newSelected[id]) {
        delete newSelected[id];
      } else {
        newSelected[id] = true;
      }
      return newSelected;
    });
  };

  /* Apply selected categories to search parameters*/
  const onApply = () => {
    setOpen(false);
    setSearchParams((prevSearchParams) => {
      const selectedCategories = categoryList.filter(
        (category: CategoryType) => selected[category.id],
      );
      const selectedCategoryNames = selectedCategories.map(
        (category: CategoryType) => category.name,
      );
      const params = prevSearchParams;

      params.delete("filter");
      for (const filter of selectedCategoryNames)
        params.append("filter", filter);
      return params;
    });
  };

  return (
    <Dialog open={open} sx={{ p: 20 }} onClose={onClose}>
      <DialogTitle>Filter by Category</DialogTitle>
      <Grid p={1} container rowSpacing={2}>
        {Object.values(categoryList).map((category: CategoryType) => (
          <Grid item xs={4} key={category.id} textAlign="center">
            <Chip
              label={category.name}
              variant={selected[category.id] ? "filled" : "outlined"}
              onClick={() => onClick(category)}
            />
          </Grid>
        ))}
      </Grid>
      <Button onClick={onApply}>Apply</Button>
    </Dialog>
  );
};

export default FilterDialog;
