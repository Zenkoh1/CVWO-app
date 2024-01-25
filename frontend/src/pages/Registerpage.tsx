import { Button, Box } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import session from "../api/sessions_manager";
import FormTextField from "../components/FormTextField";

/* This page is for registering a new user */
const Registerpage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const { setIsAuth } = useContext(session.SessionContext);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    if (email && password) {
      session.actions
        .registerUser({ user: { email, password, username } })
        .then(() => {
          if (session.getters.isLoggedIn()) {
            navigate("/");
            setIsAuth(true);
          }
        });
    }
  };

  return (
    <Box width="50vw" display="inline-block">
      <form autoComplete="off" onSubmit={handleSubmit}>
        <h2>Registration Form</h2>
        <FormTextField
          input={username}
          setInput={setUsername}
          label="Username"
        />
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
        <FormTextField
          input={confirmPassword}
          setInput={setConfirmPassword}
          type="password"
          label="Confirm Password"
          error={confirmPasswordError !== ""}
          helperText={confirmPasswordError}
        />
        <Button variant="outlined" color="secondary" type="submit">
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Registerpage;
