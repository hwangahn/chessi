import { createContext, useState } from "react"

export const AuthContext = createContext(null);
export const ProfileContext = createContext(null);

export function Auth({ children }) {

  let [accessToken, setAccessToken] = useState(null);
  let [profile, setProfile] = useState(null);

  let sessionToken = localStorage.getItem("sessionToken") === "null" ? null : localStorage.getItem("sessionToken");;

  let setSessionToken = (sessionToken) => {
    localStorage.setItem("sessionToken", sessionToken);
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, sessionToken, setSessionToken }}>
      <ProfileContext.Provider value={{ profile, setProfile }}>
        { children }
      </ProfileContext.Provider>
    </ AuthContext.Provider>
  )
}