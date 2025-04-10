import React, { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import axios from "axios"
import API_URL from "../../config"

const SearchBarNewChat = ({ setSearchResults, userData, newChat }) => {
    const [input, setInput] = useState("");
    useEffect(() => {
        if (!input) return
        const delayToCall = setTimeout(() => {
            if (input.trim() !== "") {
                axios.post(`${API_URL}/SearchBarNewChat`, { input, userData: JSON.stringify(userData) })
                    .then(result => {
                        console.log("response : ", result);
                        const searchResult = result.data.user;
                        setSearchResults(searchResult);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }, 1000)

        return () => clearTimeout(delayToCall)
    }, [input])

    const searchHandler = (value) => {
        setInput(value);
    }

    useEffect(() => {
        if (!newChat) {
            setSearchResults([]);
        }
    }, [newChat])


    return (
        <div>
            <div className="container">
                <div className="container flex px-2 py-1 items-center bg-slate-950 bg-opacity-90 w-full h-9 rounded-lg drop-shadow shadow-md hover:shadow-slate-400 duration-200">
                    <FaSearch id="Search-icon" className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        name="Search"
                        value={input}
                        autoFocus
                        onChange={(e) => searchHandler(e.target.value)}
                        maxLength={40}
                        className="text-lg cursor-pointer bg-transparent border-none outline-none w-full h-full ml-2"
                    >
                    </input>
                </div>
            </div>
        </div>
    )
}

export default SearchBarNewChat
