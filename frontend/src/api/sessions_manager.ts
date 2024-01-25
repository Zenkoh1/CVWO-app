/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
import { createContext } from "react";
import UserType from "../types/User.type";
const API_URL = process.env.REACT_APP_API_ENDPOINT;

/* API for sessions management */
type payloadType = {
  user: null | {
    username?: string | null;
    password: string | null;
    email: string | null;
  };
};
type stateType = {
  auth_token: string | null;
  user: null | {
    id: number | null;
    username: string | null;
    email: string | null;
    admin: boolean | null;
  };
};
const state: stateType = {
  auth_token: null,
  user: {
    id: null,
    username: null,
    email: null,
    admin: null,
  },
};
const mutations = {
  setUserInfo: (response: AxiosResponse<any, any>) => {
    state.auth_token = response.headers.authorization;

    state.user = response.data.user;
    axios.defaults.headers.common["Authorization"] = state.auth_token;
    localStorage.setItem("auth_token", state.auth_token as string);
  },
  setUserInfoFromToken: (response: AxiosResponse<any, any>) => {
    state.user = response.data.user;
    state.auth_token = localStorage.getItem("auth_token");
  },

  resetUserInfo: () => {
    state.auth_token = null;
    state.user = {
      id: null,
      username: null,
      email: null,
      admin: null,
    };
    localStorage.removeItem("auth_token");
    axios.defaults.headers.common["Authorization"] = state.auth_token;
  },
};

const getters = {
  getUser: () => state.user as UserType,
  getAuthToken: () => state.auth_token,
  isLoggedIn: () => {
    const loggedOut =
      state.auth_token === null || state.auth_token === JSON.stringify(null);
    return !loggedOut;
  },
};

const actions = {
  registerUser: (payload: payloadType) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_URL}/users`, payload)
        .then((response) => {
          mutations.setUserInfo(response);
          resolve(response);
        })
        .catch((error) => {
          if (error.response.status === 401 || error.response.status === 422) {
            alert("Error registering account, refresh and try again.");
          } else {
            reject(error);
          }
        });
    });
  },

  loginUser: (payload: payloadType) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_URL}/users/sign_in`, payload)
        .then((response) => {
          mutations.setUserInfo(response);
          resolve(response);
        })
        .catch((error) => {
          if (error.response.status === 401 || error.response.status === 422) {
            alert("Invalid username or password.");
          } else {
            reject(error);
          }
        });
    });
  },

  logoutUser: () => {
    const config = {
      headers: {
        authorization: state.auth_token,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .delete(`${API_URL}/users/sign_out`, config)
        .then((response) => {
          mutations.resetUserInfo();
          resolve(response);
        })
        .catch((error) => {
          if (error.response.status === 401 || error.response.status === 422) {
            alert("Error logging out, refresh and try again.");
          } else {
            reject(error);
          }
        });
    });
  },

  loginUserWithToken: (auth_token: string) => {
    const config = {
      headers: {
        Authorization: auth_token,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/member-data`, config)
        .then((response) => {
          mutations.setUserInfoFromToken(response);
          resolve(response);
        })
        .catch((error) => {
          if (error.response.status === 401 || error.response.status === 422) {
            alert("Your session has expired. Please log in again.");
            mutations.resetUserInfo();
          } else {
            reject(error);
          }
        });
    });
  },
};
interface SessionContext {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const SessionContext = createContext<SessionContext>({} as SessionContext);
export default {
  getters,
  actions,
  SessionContext,
};
