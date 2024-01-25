import "./App.css";
import { useState, useEffect } from "react";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import {
  Routes,
  Route,
  BrowserRouter,
  Link as RouterLink,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import session from "./api/sessions_manager";
import PostQuestionpage from "./pages/PostQuestionpage";
import Questionpage from "./pages/Questionpage";
import Registerpage from "./pages/Registerpage";

/* Check if JWT_Token is stored and attempt to log the user in with that token */
async function authenticate(): Promise<boolean> {
  const cookiesExists =
    localStorage.auth_token !== null && localStorage.auth_token !== undefined;

  if (cookiesExists) {
    const auth_token = localStorage.getItem("auth_token");
    const authTokenExists = auth_token !== null && auth_token !== undefined;

    if (authTokenExists) {
      await session.actions.loginUserWithToken(auth_token);
      return true;
    }
  }
  return false;
}

function App() {
  useEffect(() => {
    document.title = "CVWO - Parentit";
  }, []);

  const [userInfoLoaded, setUserInfoLoaded] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    authenticate().then((val) => {
      setUserInfoLoaded(true);
      setIsAuth(val);
    });
  }, []);

  if (!userInfoLoaded) {
    return (
      <Stack alignItems="center">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    /* Provider exposes whether the user is authenticated or not to the application*/
    <session.SessionContext.Provider value={{ isAuth, setIsAuth }}>
      <div className="App">
        <BrowserRouter>
          <AppBar position="static" elevation={0}>
            <Toolbar
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <Typography
                  sx={{ textDecoration: "none", fontWeight: "bold" }}
                  variant="h6"
                  color="inherit"
                  component={RouterLink}
                  to="/"
                >
                  Parentit
                </Typography>
              </div>
              <div>
                {!isAuth ? (
                  <Stack spacing={2} direction="row">
                    <Button
                      className="Button"
                      variant="contained"
                      color="secondary"
                      component={RouterLink}
                      to="/login"
                    >
                      Login
                    </Button>
                    <Button
                      className="Button"
                      variant="contained"
                      color="secondary"
                      component={RouterLink}
                      to="/register"
                    >
                      Register
                    </Button>
                  </Stack>
                ) : (
                  <Stack spacing={2} direction="row">
                    <Button
                      className="Button"
                      variant="contained"
                      component={RouterLink}
                      to="/post_question"
                    >
                      Post Question
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        session.actions
                          .logoutUser()
                          .then(() => setIsAuth(false))
                          .catch(() => {
                            alert("Error logging out, refresh the page!");
                          });
                      }}
                    >
                      Logout
                    </Button>
                  </Stack>
                )}
              </div>
            </Toolbar>
          </AppBar>

          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/question/:id" element={<Questionpage />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/register" element={<Registerpage />} />
            <Route path="/post_question" element={<PostQuestionpage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </session.SessionContext.Provider>
  );
}

export default App;
