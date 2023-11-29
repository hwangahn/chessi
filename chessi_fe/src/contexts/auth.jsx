import { createContext, useReducer } from "react"
import socket from "../utils/socket";

export const AuthContext = createContext(null);

export function Auth({ children }) {

  let accessTokenReducer = (accessToken, action) => {
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

  let [accessToken, dispatchAccessToken] = useReducer(accessTokenReducer, null);
  let [profile, dispatchProfile] = useReducer(profileReducer, null);

  let sessionToken = localStorage.getItem("sessionToken") === "null" ? null : localStorage.getItem("sessionToken");

  let setSessionToken = (sessionToken) => {
    localStorage.setItem("sessionToken", sessionToken);
  }

  let clearSessionToken = () => {
    localStorage.clear("sessionToken");
  }

  let useSilentLogin = async () => {
    if (sessionToken) { // persisting session
      try {
        let rawData = await fetch("/api/silent-login", {
          method: "post",
          headers: {
            'authorization': 'Bearer ' + sessionToken,
            'Content-Type': 'application/json',
          }, 
          body: JSON.stringify({
            socketid: socket.id
          })
        });

        let data = await rawData.json();
        
        if (data.status === "ok") {
          silentLogin(data.accessToken, data.profile);
        } else {
          logout();
        }

        return data;
      } catch(err) {
        console.log(err);
      }
    } else {
      if (accessToken && profile) { // user tries to open website in another tab, leading to loss of session token
        logout();
        return { status: "error", msg: "Please log in again" }
      }
    }
  }

  let useLogin = async (formData) => {
    if (socket.connected) {
      try {
        let rawData = await fetch("/api/login", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
          body: JSON.stringify({
            data: formData
          })
        });

        let data = await rawData.json();

        if (data.status === "ok") {
          login(data.accessToken, data.profile, data.sessionToken);
        }

        return data;
      } catch(err) {
        console.log(err);
      }
    } else {
      return { status: "error", msg: "Cannot connect to server. Please try again later" }
    }
  }

  let useSignup = async (formData) => {
    try {
      let rawData = await fetch("/api/signup", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        body: JSON.stringify({
          data: formData
        })
      });

      let data = await rawData.json();
      
      return data;
    } catch(err) {
      console.log(err);
    }
  }

  let useLogout = async () => {
    if (socket.connected) {
      try {
        await fetch("/api/logout", {
          method: "post",
          headers: {
            'authorization': 'Bearer ' + accessToken,
          }
        });
        
        logout();
        
        return { status: "ok", msg: "Logged out" }
      } catch(err) {
        console.log(err);
      }
    } else {
      return { status: "error", msg: "Cannot connect to server" };
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
    <AuthContext.Provider value={{ accessToken, sessionToken, profile, silentLogin, useSilentLogin, useLogin, useSignup, useLogout }}>
        { children }
    </AuthContext.Provider>
  )
}