import { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { MdCall } from "react-icons/md";
import { SOCKET_URL } from "../../../../config";

const APP_ID = "8cb18dd5032842c0b066d4fdd63e2d54"; // Replace with your Agora App ID
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const VoiceCall = ({ channelName, socket, userData, roomInfo, receiverInfo, receiverId, joined, setJoined, callDown, setCallDown, setShowPopup, setCallerInfo }) => {
    const [localAudioTrack, setLocalAudioTrack] = useState(null);

    // useEffect(() => {
    //     return () => {
    //         if (joined) leaveCall();
    //     };
    // }, [joined]);

    const joinCall = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:3002/agora-token?channelName=${channelName}`);
            const data = await res.json();

            console.log("Received Agora Token Data:", data);

            if (!data.token) {
                throw new Error("No token received from backend");
            }

            await client.join(data.appId, data.channelName, data.token, data.uid); // Use the same UID

            const localTrack = await AgoraRTC.createMicrophoneAudioTrack();
            setLocalAudioTrack(localTrack);
            await client.publish([localTrack]);

            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                if (mediaType === "audio") {
                    user.audioTrack.play();
                }
            });

            setJoined(true);
            setCallerInfo(receiverInfo);
            setTimeout(() => {
                leaveCall();
            }, 2000);
        } catch (error) {
            console.error("Error joining call:", error);
        }
    };

    const leaveCall = async () => {
        if (localAudioTrack) {
            localAudioTrack.stop();
            localAudioTrack.close();
            console.log("leave call from voice call---------------------------------");
            setTimeout(() => {
                setShowPopup(true)
            }, 0);
        }
        else {
            console.log("not leave call from voice call");
            socket.emit("calling", { channelName, userData, receiverInfo, receiverId });
        }
        await client.leave();
    };

    if (joined) leaveCall();

    return (
        <div>
            {joined ? (
                <button onClick={leaveCall}>
                    Leave Call
                </button>
            ) : (
                <button
                    className="cursor-pointer text-2xl rounded-full bg-slate-800 border-[0.01px] border-slate-600 p-1 hover:bg-slate-950 hover:border-slate-500 duration-300"
                    onClick={joinCall}>
                    <MdCall />
                </button>
            )}
        </div>
    );
};

export default VoiceCall;
