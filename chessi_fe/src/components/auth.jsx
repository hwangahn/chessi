import { createContext, useReducer } from "react"
import { message } from "antd";
import socket from "../utils/socket";

export const AuthContext = createContext(null);

let accessTokenReducer = (accessToken, action) => {
  console.log(accessToken);
  switch (action.type) {
    case "set": {
      return action.accessToken;
    }
    case "clear": {
      return null;
    }
  }
}

let profileReducer = (profile, action) => {
  switch (action.type) {
    case "set": {
      return action.profile;
    }
    case "clear": {
      return null;
    }
  }
}

export function Auth({ children }) {

  let [accessToken, dispatchAccessToken] = useReducer(accessTokenReducer, null);
  let [profile, dispatchProfile] = useReducer(profileReducer, null);

  let sessionToken = localStorage.getItem("sessionToken") === "null" ? null : localStorage.getItem("sessionToken");

  let setSessionToken = (sessionToken) => {
    localStorage.setItem("sessionToken", sessionToken);
  }

  let clearSessionToken = () => {
    localStorage.clear("sessionToken");
  }

  let useSilentLogin = () => {
    if (sessionToken) {
      fetch("/api/silent-login", {
        method: "post",
        headers: {
          'authorization': 'Bearer ' + sessionToken,
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
          socketID: socket.id
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "error") {
          message.error(data.msg);
        } else {
          silentLogin(data.accessToken, data.profile);
        }
      });
    }
  }

  let silentLogin = (accessToken, profile) => {
    dispatchAccessToken({
      type: "set",
      accessToken: accessToken
    });
    dispatchProfile({
      type: "set",
      profile: profile
    });
  }

  let login = (accessToken, profile, sessionToken) => {
    dispatchAccessToken({
      type: "set",
      accessToken: accessToken
    });
    dispatchProfile({
      type: "set",
      profile: profile
    });
    setSessionToken(sessionToken);
  }

  let logout = () => {
    dispatchAccessToken({
      type: "clear"
    });
    dispatchProfile({
      type: "clear"
    });
    clearSessionToken();
  }

  return (
    <AuthContext.Provider value={{ accessToken, dispatchAccessToken, sessionToken, setSessionToken, profile, dispatchProfile, useSilentLogin, login, logout }}>
        { children }
    </AuthContext.Provider>
  )
}