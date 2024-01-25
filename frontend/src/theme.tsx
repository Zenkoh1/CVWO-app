import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material";
export default createTheme({
  palette: {
    primary: {
      main: "#e4d7cb",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontFamily: ["Calibri", "BlinkMacSystemFont", '"Segoe UI"', "Roboto"].join(
      ",",
    ),
    button: {
      fontWeight: 700,
    },
  },
});
