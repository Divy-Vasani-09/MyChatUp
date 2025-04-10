import { useState, useEffect } from "react";
import {
    LocalUser,
    RemoteUser,
    useIsConnected,
    useJoin,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteUsers,
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { MdCall } from "react-icons/md";
import { MdCallEnd } from "react-icons/md";
import { BsMicFill } from "react-icons/bs";
import { BsMicMuteFill } from "react-icons/bs";
import { PiSpeakerHighFill } from "react-icons/pi";
import { PiSpeakerXFill } from "react-icons/pi";
import UserIcon from "C:/Users/Destiny/OneDrive/Desktop/MyChatUp/client/src/assets/profile.png";
import { SOCKET_URL } from "../../../../config";

const APP_ID = "8cb18dd5032842c0b066d4fdd63e2d54"; // Replace with your Agora App ID
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const ReceivedVoiceCall = ({
    channelName,
    socket,
    userData,
    roomInfo,
    receiverId,
    callerInfo,
    setCallerInfo,
    callDataId,
    setCallDataId,
    joined,
    setJoined,
    showPopup,
    setShowPopup,
}) => {
    const [micOn, setMicOn] = useState(true);
    const [speakerOn, setSpeakerOn] = useState(true);

    const receiverInfo = roomInfo?.receiverInfo;
    const dpUrl = !callerInfo?.DP ? UserIcon : callerInfo.DP;

    const [localAudioTrack, setLocalAudioTrack] = useState(null);
    const [remoteAudioTrack, setRemoteAudioTrack] = useState(null);

    // useEffect(() => {
    //     return () => {
    //         if (joined) leaveCall();
    //     };
    // }, [joined]);

    useEffect(() => {
        if (!socket) return;
        const handleReceivedCall = (data) => {
            console.log("received in received----------->:", data.from);
            if (joined) {
                joinCall();
            }
        }

        const handleCallDown = (data) => {
            console.log("call Down ----------------->", data.from);
            if (callDataId === "") {
                return
            }
            if (joined) {
                leaveCall();
                setJoined(false);
            }
        }

        socket.on("receivedCall", handleReceivedCall);
        socket.on("callDown", handleCallDown);

        return () => {
            socket.off("receivedCall", handleReceivedCall);
            socket.off("callDown", handleCallDown);
        }
    });
    const handleDecline = () => {
        setShowPopup(false);
        setJoined(false);
        socket.emit("declineCall", { channelName, userData, receiverInfo, receiverId, callDataId });
    }
    const handleAccept = () => {
        joinCall()
        socket.emit("acceptCall", { channelName, userData, receiverInfo, receiverId, callDataId });
    }

    // const joinCall = async () => {
    //     try {
    //         const res = await fetch(`${SOCKET_URL}/agora-token?channelName=${channelName}`, {
    //             method: "GET",
    //             headers: { "Content-Type": "application/json" },  // ✅ Ensure correct headers
    //         });
    //         const data = await res.json();
    //         console.log("join from received===========================")

    //         console.log("Received Agora Token Data:", data);

    //         if (!data.token) {
    //             throw new Error("No token received from backend");
    //         }

    //         await client.join(data.appId, data.channelName, data.token, data.uid); // Use the same UID

    //         const localTrack = await AgoraRTC.createMicrophoneAudioTrack();
    //         setLocalAudioTrack(localTrack);
    //         await client.publish([localTrack]);

    //         client.on("user-published", async (user, mediaType) => {
    //             await client.subscribe(user, mediaType);
    //             if (mediaType === "audio") {
    //                 user.audioTrack.play();
    //                 setRemoteAudioTrack(user.audioTrack);
    //             }
    //         });

    //         setJoined(true);
    //     } catch (error) {
    //         console.error("Error joining call:", error);
    //     }
    // };

    const joinCall = async () => {
        try {
            console.log("Joining call...");
            console.log("Fetching Agora token from:", `${SOCKET_URL}/agora-token?channelName=${channelName}`);

            // const res = await fetch(`${SOCKET_URL}/agora-token?channelName=${channelName}`, {
            const res = await fetch(`https://41f4-110-227-210-237.ngrok-free.app/agora-token?channelName=${channelName}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            console.log("Received Agora Token Data:", data);

            if (!data.token) {
                throw new Error("No token received from backend");
            }

            console.log("Joining Agora with token...");
            await client.join(data.appId, data.channelName, data.token, data.uid);

            console.log("Creating local audio track...");
            const localTrack = await AgoraRTC.createMicrophoneAudioTrack();
            setLocalAudioTrack(localTrack);

            console.log("Publishing local track...");
            await client.publish([localTrack]);

            client.on("user-published", async (user, mediaType) => {
                console.log("New user published:", user);
                await client.subscribe(user, mediaType);

                if (mediaType === "audio") {
                    console.log("Playing remote audio...");
                    user.audioTrack.play();
                    // setRemoteAudioTrack(user.audioTrack);
                }
            });

            setJoined(true);
            console.log("Call joined successfully! 🎉");
        } catch (error) {
            console.error("Error joining call:", error);
        }
    };


    // mute or unmute our mic
    const handleLocalAudio = () => {
        if (micOn) {
            // Mute Local
            if (localAudioTrack) localAudioTrack.setEnabled(false);
            setMicOn(false);
            return
        }
        else {
            // Unmute Local
            if (localAudioTrack) localAudioTrack.setEnabled(true);
            setMicOn(true);
            return
        }
    };

    // mute or unMute Remote user
    const handleRemoteAudio = () => {
        if (speakerOn) {
            // Mute Remote
            if (remoteAudioTrack) remoteAudioTrack.setVolume(0);
            setSpeakerOn(false);
            return
        }
        else {
            // Unmute Remote
            if (remoteAudioTrack) remoteAudioTrack.setVolume(100);
            setSpeakerOn(true);
            return
        }
    };

    const leaveCall = async () => {
        if (localAudioTrack) {
            // await client.unpublish([localAudioTrack]);

            localAudioTrack.stop();
            localAudioTrack.close();
            setLocalAudioTrack(null);
            console.log("leave call from received call-------------------->")
        }

        await client.leave();
        setJoined(false);
        setShowPopup(false);

        socket.emit("callDown", { channelName, userData, receiverInfo, receiverId, callDataId });
        setCallDataId("");
    };

    return (
        <div>
            {!joined ?
                (<div className="w-full h-full bg-white">
                    <div className="w-full h-full bg-slate-900">
                        <div className="flex flex-col justify-center text-center w-full h-full bg-whit">
                            <div className="flex flex-col justify-around bg-slate-950 mx-auto size-96 rounded-2xl">
                                <h2 className="mx-auto text-white ">
                                    Incoming Voice call
                                </h2>
                                <div
                                    style={{ backgroundImage: `url(${dpUrl})` }}
                                    className="relative flex flex-col justify-center mx-auto size-56 bg-cover bg-center bg-slate-900 rounded-3xl overflow-hidden"
                                >
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

                                    <div className="relative z-10 w-full h-full flex flex-col justify-around  items-center">
                                        <div className="w-full">
                                            <img
                                                className="w-24 h-24 mx-auto rounded-full"
                                                src={!callerInfo?.DP ? UserIcon : callerInfo?.DP}
                                            />
                                            <h2 className="mx-auto text-white">
                                                {callerInfo.UserName}
                                            </h2>
                                        </div>

                                    </div>
                                </div>
                                <div className="flex justify-center mx-auto gap-2">
                                    <button
                                        className="flex items-center justify-center gap-1 mx-auto my-auto text-white rounded-full bg-red-600 border border-slate-600 py-1 px-2 hover:bg-red-700 hover:border-slate-500 duration-300"
                                        // onClick={() => setShowPopup(false)}
                                        onClick={handleDecline}
                                    >
                                        <div className="flex items-center pr-1 border-r-2 border-slate-300 h-full">
                                            <MdCallEnd className="text-xl" />
                                        </div>
                                        <p className="text-xl">
                                            Decline
                                        </p>
                                    </button>
                                    <button
                                        onClick={handleAccept}
                                        className="flex items-center justify-center gap-1 mx-auto my-auto text-white rounded-full bg-green-600 border border-slate-600 py-1 px-2 hover:bg-green-700 hover:border-slate-500 duration-300"
                                    >
                                        <div className="flex items-center pr-1 border-r-2 border-slate-300 h-full">
                                            <MdCall className="text-xl" />
                                        </div>
                                        <p className="text-xl">
                                            Accept
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ) : (
                    <div className="w-full h-full">
                        <div className="w-full h-full bg-slate-900">
                            <div className="flex flex-col justify-center text-center w-full h-full bg-whit">
                                <div className="flex flex-col justify-around bg-slate-950 mx-auto size-96 rounded-2xl">
                                    <h2 className="mx-auto text-white ">
                                        Voice call
                                    </h2>
                                    <div
                                        style={{ backgroundImage: `url(${dpUrl})` }}
                                        className="relative flex flex-col justify-center mx-auto size-56 bg-cover bg-center bg-slate-900 rounded-3xl overflow-hidden"
                                    >
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

                                        <div className="relative z-10 w-full h-full flex flex-col justify-around  items-center">
                                            <div className="w-full">
                                                <img
                                                    className="w-24 h-24 mx-auto rounded-full"
                                                    src={!callerInfo?.DP ? UserIcon : callerInfo?.DP}
                                                />
                                                <h2 className="mx-auto text-white">
                                                    {callerInfo.UserName}
                                                </h2>
                                            </div>

                                        </div>
                                    </div>

                                    <div
                                        className="flex justify-center gap-4 p-1 mx-auto w-56 bg-slate-00 rounded-full"
                                    >
                                        <button
                                            onClick={handleLocalAudio}
                                            className="text-2xl rounded-full bg-slate-900 border-[0.01px] border-slate-600 p-1 hover:bg-slate-700 hover:border-slate-500 duration-300"
                                        >
                                            {micOn ? <BsMicFill /> : <BsMicMuteFill />}
                                        </button>
                                        <button
                                            onClick={handleRemoteAudio}
                                            className="text-2xl rounded-full bg-slate-900 border-[0.01px] border-slate-600 p-1 hover:bg-slate-700 hover:border-slate-500 duration-300"
                                        >
                                            {speakerOn ? <PiSpeakerHighFill /> : <PiSpeakerXFill />}
                                        </button>
                                        <button
                                            onClick={leaveCall}
                                            className="text-2xl rounded-full bg-red-600 border-[0.01px] border-slate-600 p-1 hover:bg-red-700 hover:border-slate-500 duration-300"
                                        >
                                            <MdCallEnd />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ReceivedVoiceCall;