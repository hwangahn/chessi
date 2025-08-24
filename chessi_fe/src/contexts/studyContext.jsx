import { createContext, useState, useContext } from "react";
import { AuthContext } from "./auth";

export const StudyContentContext = createContext(null);

export function StudyContent({ children }) {
    let { profile } = useContext(AuthContext);

    let [study, setStudy] = useState({ id: 10, name: "test" });
    let [name, setName] = useState("");
    let [description, setDescription] = useState("");
    let [chapters, setChapters] = useState([{ id: 12, name: "Test 1" }, { id: 13, name: "Test 2" }]); // fake data
    let [members, setMembers] = useState([profile]);

    return (
        <StudyContentContext.Provider value={{ study, setStudy, name, setName, description, setDescription, chapters, setChapters, members, setMembers }}>
            {children}
        </StudyContentContext.Provider>
    )
}