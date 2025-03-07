import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import Loader from './Loader';
import axios from 'axios';

import { FaRegSmile } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa6";
import { FaRegImage } from "react-icons/fa6";
import { RiFolderVideoLine } from "react-icons/ri";
import { IoSendSharp } from "react-icons/io5";

import EmojiPicker from 'emoji-picker-react';
import { useSearchParams } from 'react-router-dom';

export default function ChatInput({ roomInfo, inputRef, setNewMessage, setNewImageMessage, setNewVideoMessage, chats, }) {

    const [inputOfMessage, setInputOfMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [showFileOptions, setShowFileOptions] = useState(false);
    const [showSelectedImage, setShowSelectedImage] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [sizeLimitError, setsizeLimitError] = useState('');
    const [showSelectedVideo, setShowSelectedVideo] = useState(false);
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [loader, setLoader] = useState(false);

    const emojiPickerRef = useRef();
    const paperclipOptionRef = useRef();
    const imageUploadRef = useRef();
    const videoUploadRef = useRef();
    const selectedRef = useRef();

    const inputValueHandler = (e) => {
        setInputOfMessage(e.target.value);
    }

    const handleShowEmoji = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }
    const handleEmoji = (e) => {
        setInputOfMessage((prev) => prev + e.emoji);
        inputRef.current.focus();
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    const handleShowOption = () => {
        setShowFileOptions(!showFileOptions);
        setShowSelectedImage(false);
        setShowSelectedVideo(false);
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (paperclipOptionRef.current && !paperclipOptionRef.current.contains(event.target)) {
                setShowFileOptions(false);
            }
        };

        if (showFileOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFileOptions]);

    const handleImageUpload = (e) => {
        e.preventDefault();
        imageUploadRef.current.click();
        setsizeLimitError('')
    }
    const handleVideoUpload = (e) => {
        e.preventDefault();
        videoUploadRef.current.click();
        setsizeLimitError('')
    }

    const handleImageInput = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);

            const maxSize = 1 * 1024 * 1024; // 1MB size limit
            const validFiles = files.filter(file => file.size <= maxSize);

            if (validFiles.length !== files.length) {
                return setsizeLimitError("Please upload images under 1MB!");
            }

            const convertToBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });

            Promise.all(files.map(convertToBase64))
                .then(base64Images => {
                    setSelectedImages(base64Images); // Store Base64 images for preview
                    setShowFileOptions(false);
                    setShowSelectedImage(true);
                })
                .catch(error => console.error("Error converting images:", error));
            inputRef.current.focus();
        }
    };
    const handleVideoInput = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);

            const maxSize = 10 * 1024 * 1024; // 10MB size limit
            const validFiles = files.filter(file => file.size <= maxSize);

            if (validFiles.length !== files.length) {
                setsizeLimitError("Please upload videos under 10MB!");
                return;
            }

            const convertToBase64 = (file) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                });

            Promise.all(validFiles.map(convertToBase64))
                .then(base64Videos => {
                    setSelectedVideos(base64Videos); // Store Base64 images for preview
                    console.log(base64Videos)
                    setShowFileOptions(false);
                    setShowSelectedVideo(true);
                })
                .catch(error => console.error("Error converting videos:", error));

            inputRef.current.focus();
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectedRef.current && !selectedRef.current.contains(event.target)) {
                setShowSelectedImage(false);
                setSelectedImages();
                setShowSelectedVideo(false);
                setSelectedVideos();
            }
        };

        if (showSelectedImage || showSelectedVideo) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSelectedImage, showSelectedVideo]);

    useEffect(() => {
        setLoader(false);
    }, [chats])


    const sendMessageHandler = () => {
        console.log(inputOfMessage.length);
        if (inputOfMessage.length !== 0 || selectedImages || selectedVideos) {
            setNewMessage(inputOfMessage);
            setNewImageMessage(selectedImages);
            setNewVideoMessage(selectedVideos);
            setLoader(true);
        }

        setInputOfMessage('');
        setSelectedImages([]);
        setSelectedVideos([]);
        setShowSelectedImage(false);
        setShowSelectedVideo(false);
    }

    return (
        <div className='relative container w-full h-full flex justify-between'>
            <div
                className='
                    flex justify-around
                    w-11/12 
                    mx-auto 
                    bg-slate-800 
                    rounded-lg 
                    drop-shadow shadow-sm hover:shadow-slate-300 
                    border-[0.1px] border-slate-600 
                    duration-300 
                '
            >
                {
                    showEmojiPicker &&
                    <span
                        ref={emojiPickerRef}
                        className='absolute bottom-10 left-0'
                    >
                        <EmojiPicker
                            height={350}
                            width={300}
                            theme="dark"
                            emojiStyle="apple"
                            reactionsDefaultOpen={false}
                            lazyLoad={false}
                            onEmojiClick={handleEmoji}
                            className="custom-emoji-picker"
                            style={{
                                backgroundColor: '#0f172a', // Dark background color
                                borderRadius: '15px',
                                borderColor: '#1E293B', // Add rounded corners if needed
                                boxShadow: '10px 10px 50px rgba(0, 0, 1, 0.9)',
                            }}
                            emojiPickerStyle={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: '#0f172a', // Dark theme background
                                borderRadius: '5px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }}
                            inputStyle={{
                                backgroundColor: '#0f172a', // Background color of the search input
                                color: '#fff',
                            }}
                            searchStyle={{
                                backgroundColor: '#0f172a', // Background color of the search input
                                color: '#fff',           // Text color of the search input
                                padding: '8px 82px',     // Padding inside the search box
                                border: '0px solid #555',// Border color
                                borderRadius: '5px',     // Rounded corners
                                width: '90%',            // Width of the search box (adjustable)
                                marginBottom: '5px',    // Spacing below the search box
                            }}
                            placeholderStyle={{
                                color: '#fff',           // Placeholder text color
                                fontStyle: 'italic',     // Italic placeholder text
                            }}
                            emojiCategoryButtonStyle={{
                                color: '#f1f1f1', // Text color for category buttons
                                backgroundColor: '#0f172a', // Button background color
                                padding: '98px 16px',
                                borderRadius: '25px',
                                marginBottom: '5px',
                            }}
                        />
                    </span>
                }
                {
                    showFileOptions &&
                    <div
                        ref={paperclipOptionRef}
                        className='absolute index-10 bottom-11 left-10 flex flex-col gap-1 bg-black rounded-md'>
                        <p className={`text-red-500 ${sizeLimitError ? 'w-36' : ''} bg-slate-800 rounded-lg`}>
                            {sizeLimitError}
                        </p>
                        <div className='Image-Input-Button'>
                            <input
                                type="file"
                                // multiple
                                accept="image/jpeg, image/png"
                                ref={imageUploadRef}
                                onChange={(e) => handleImageInput(e)}
                                hidden
                            />
                            <button
                                onClick={handleImageUpload}
                                className="cursor-pointer flex gap-1 my-auto items-center mx-1 text-2xl text-slate-300 rounded-sm bg-slate-950 p-1 border-b-[0.1px] border-slate-700 hover:text-slate-200 hover:bg-slate-900 duration-300"
                            >
                                <FaRegImage />
                                <p className='text-base'>
                                    Photos
                                </p>
                            </button>
                        </div>
                        <div className='Image-Input-Button'>
                            <input
                                type="file"
                                // multiple
                                accept="video/*"
                                ref={videoUploadRef}
                                onChange={(e) => handleVideoInput(e)}
                                hidden
                            />
                            <button
                                onClick={handleVideoUpload}
                                className="cursor-pointer flex gap-1 my-auto items-center mx-1 text-2xl text-slate-300 rounded-sm bg-slate-950 p-1 border-b-[0.1px] border-slate-700 hover:text-slate-200 hover:bg-slate-900 duration-300"
                            >
                                <RiFolderVideoLine />
                                <p className='text-base'>
                                    Video
                                </p>
                            </button>
                        </div>
                    </div>
                }
                {
                    showSelectedImage &&
                    <div
                        ref={selectedRef}
                        className='absolute bottom-11 left-1 h-[500%] overflow-y-auto scroll-smooth flex flex-col gap-2 bg-slate-700 p-2 rounded-md'
                    >

                        <img
                            src={selectedImages}
                            alt="selectedImage"
                            className='h-[10rem] w-[10rem] border-b-[0.1px] border-slate-300'
                        />
                    </div>
                }
                {
                    showSelectedVideo &&
                    <div
                        ref={selectedRef}
                        className='absolute bottom-11 left-1  overflow-y-auto scroll-smooth flex flex-col gap-2 bg-slate-700 p-2 rounded-md'
                    >
                        <video width="250" height="100" controls >
                            <source src={selectedVideos} type="video/mp4" />
                        </video>
                    </div>
                }
                <div
                    onClick={handleShowEmoji}
                    className="cursor-pointer my-auto items-center mx-1 text-2xl text-slate-400 rounded-full bg-slate-800 p-1 border-[0.1px] border-slate-900 hover:text-slate-300 hover:bg-slate-950 duration-300"
                >
                    <FaRegSmile />
                </div>
                <div
                    onClick={handleShowOption}
                    className="cursor-pointer my-auto items-center mx-1 text-xl text-slate-400 rounded-full bg-slate-800 p-1 border-[0.1px] border-slate-900 hover:text-slate-300 hover:bg-slate-950 duration-300"
                >
                    <FaPaperclip />
                </div>
                <textarea
                    type='text'
                    placeholder='Write a message'
                    name='Message'
                    ref={inputRef}
                    autoFocus
                    value={inputOfMessage}
                    onChange={inputValueHandler}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (!loader) {
                                sendMessageHandler();
                            }
                        }
                    }}
                    onClick={() => setShowEmojiPicker(false)}
                    className='font-normal text-base bg-transparent py-1 px-2 rounded-lg w-11/12 outline-none no-scrollbar resize-none'
                >
                </textarea>
            </div>
            {
                loader ?
                    <div
                        className='cursor-pointer flex justify-around rounded-lg border-[0.1px] border-slate-600'
                    >
                        <div
                            className="my-auto mx-2 text-2xl text-slate-300 bg-slate-800 p-1 hover:text-slate-200 hover:bg-slate-950 duration-300"
                        >
                            <Loader />
                        </div>
                    </div>
                    :
                    <div
                        className='cursor-pointer flex justify-around rounded-lg border-[0.1px] border-slate-600'
                        onClick={sendMessageHandler}
                    >
                        <div
                            className="my-auto mx-2 text-2xl text-slate-300 bg-slate-800 p-1 hover:text-slate-200 hover:bg-slate-950 duration-300"
                        >
                            <IoSendSharp />
                        </div>
                    </div>
            }
        </div >
    )
}
