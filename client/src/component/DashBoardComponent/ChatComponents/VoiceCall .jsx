// import { useState, useEffect } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";

// const APP_ID = "8cb18dd5032842c0b066d4fdd63e2d54"; // Replace with your Agora App ID
// const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

// const VoiceCall = ({ channelName }) => {
//     const [joined, setJoined] = useState(false);
//     const [localAudioTrack, setLocalAudioTrack] = useState(null);

//     useEffect(() => {
//         return () => {
//             if (joined) leaveCall();
//         };
//     }, [joined]);

//     const joinCall = async () => {
//         try {
//             const res = await fetch(`http://127.0.0.1:3002/agora-token?channelName=${channelName}`);
//             const data = await res.json();
    
//             console.log("Received Agora Token Data:", data);
    
//             if (!data.token) {
//                 throw new Error("No token received from backend");
//             }
    
//             await client.join(data.appId, data.channelName, data.token, data.uid); // Use the same UID
    
//             const localTrack = await AgoraRTC.createMicrophoneAudioTrack();
//             setLocalAudioTrack(localTrack);
//             await client.publish([localTrack]);
    
//             client.on("user-published", async (user, mediaType) => {
//                 await client.subscribe(user, mediaType);
//                 if (mediaType === "audio") {
//                     user.audioTrack.play();
//                 }
//             });
    
//             setJoined(true);
//         } catch (error) {
//             console.error("Error joining call:", error);
//         }
//     };
    
    

//     const leaveCall = async () => {
//         if (localAudioTrack) {
//             localAudioTrack.stop();
//             localAudioTrack.close();
//         }
//         await client.leave();
//         setJoined(false);
//     };

//     return (
//         <div>
//             {joined ? (
//                 <button onClick={leaveCall}>Leave Call</button>
//             ) : (
//                 <button onClick={joinCall}>Join Call</button>
//             )}
//         </div>
//     );
// };

// export default VoiceCall;
