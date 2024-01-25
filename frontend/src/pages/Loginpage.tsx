import { Button, Box } from "@mui/material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import session from "../api/sessions_manager";
import FormTextField from "../components/FormTextField";

/* This page is for logging in a user */
const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuth } = useContext(session.SessionContext);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email && password) {
      session.actions.loginUser({ user: { email, password } }).then(() => {
        if (session.getters.isLoggedIn()) {
          setIsAuth(true);
          navigate("/");
        }
      });
    }
  };

  return (
    <Box width="50vw" display="inline-block">
      <form autoComplete="off" onSubmit={handleSubmit}>
        <h2>Login Form</h2>
        <FormTextField
          input={email}
          setInput={setEmail}
          type="email"
          label="Email"
        />
        <FormTextField
          input={password}
          setInput={setPassword}
          type="password"
          label="Password"
        />
        <Button variant="outlined" color="secondary" type="submit">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Loginpage;
