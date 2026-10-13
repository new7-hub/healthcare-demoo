import { createContext, useEffect, useReducer } from "react";

const readUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "null"); }
  catch { return null; }
};

const initialState = {
  user: readUser(),
  role: localStorage.getItem("role") || null,
  token: localStorage.getItem("token") || null,
};

export const authContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START": return { user: null, role: null, token: null };
    case "LOGIN_SUCCESS": return { user: action.payload.user, token: action.payload.token, role: action.payload.role };
    case "LOGOUT": return { user: null, role: null, token: null };
    default: return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    if (state.user) localStorage.setItem("user", JSON.stringify(state.user)); else localStorage.removeItem("user");
    if (state.token) localStorage.setItem("token", state.token); else localStorage.removeItem("token");
    if (state.role) localStorage.setItem("role", state.role); else localStorage.removeItem("role");
  }, [state]);
  return <authContext.Provider value={{ ...state, dispatch }}>{children}</authContext.Provider>;
};
