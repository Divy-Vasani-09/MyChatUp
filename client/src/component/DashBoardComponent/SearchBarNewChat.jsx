import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaSearch } from 'react-icons/fa'

const SearchBarNewChat = ({setSearchResults}) => {
    const [input, setInput] = useState("");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (input.trim() !== "") {
                axios.get('http://127.0.0.1:3002/SearchBarNewChat', { params: { input } })
                    .then(result => {
                        console.log(result)
                        const searchResult = result.data.user;
                        setSearchResults(searchResult)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }, 1000)

        return () => clearTimeout(delayDebounceFn)
    }, [input])

    const searchHandler = (value) => {
        setInput(value);
    }

    return (
        <div>
            <div className="container">
                <div className="container flex px-2 py-1 items-center bg-blue-900 opacity-95 w-full h-9 rounded-lg drop-shadow shadow-md hover:shadow-blue-600 duration-100">
                    <FaSearch id="Search-icon" className='text-slate-400' />
                    <input
                        type='text'
                        placeholder='Search'
                        name='Search'
                        value={input}
                        onChange={(e) => searchHandler(e.target.value)}
                        maxLength={40}
                        className='text-lg cursor-pointer bg-transparent border-none outline-none w-full h-full ml-2'
                    >
                    </input>
                </div>
            </div>
        </div>
    )
}

export default SearchBarNewChat
