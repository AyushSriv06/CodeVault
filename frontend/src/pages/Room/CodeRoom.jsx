/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import NavBar from "../../components/NavBar/NavBar";
import InputWindow from "../../components/InputWindow/InputWindow";
import OutputWindow from "../../components/OutputWindow/OutputWindow";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import peer from "../../services/peer";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import Register from "../../components/Login/Register";
import ReactPlayer from "react-player";
import { useSelector, useDispatch } from "react-redux";
import { updateCode } from "../../redux/slices/codeSlice";
import { updateLanguage } from "../../redux/slices/languageSlice";
import { updateUserInput } from "../../redux/slices/userInputSlice";
const CodeRoom = () => {
        const dispatch = useDispatch();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const [users, setUsers] = useState([]);
        const [me, setMe] = useState({
                username: "User 1",
                socketID: "",
        });
        const [otherUser, setOtherUser] = useState({
                username: "User 2",
                socketID: "",
        });

        const location = useLocation();
        const [socket, setSocket] = useState(null);
        const { roomID } = useParams();
        useEffect(() => {
                if (!socket && isLoggedIn()) {
                        setSocket(io(backendUrl));
                        socket && socket.emit("languageChange", { language: "java", roomID: roomID });
                }
                if (!isLoggedIn()) {
                        window.location.href = frontendUrl + "/room";
                }

                return () => {
                        socket?.disconnect();
                };
        }, [socket]);

        const navigate = useNavigate();
        const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
        function leaveRoom() {
                myStream &&
                        myStream.getTracks().forEach((track) => {
                                track.stop();
                        });

                socket && socket.emit("endVideoCall", { to: otherUser.socketID });
                window.location.href = frontendUrl + "/room";
        }

        useEffect(() => {
                const username = localStorage.getItem("username");
                socket && socket.emit("userdetails", { username: username, roomID: roomID });
                socket &&
                        socket.on("getUserDetails", (userRoom) => {
                                const { users } = userRoom;
                                setUsers(users);

                                if (users.length == 1) {
                                        setMe(users[0]);
                                        setOtherUser({
                                                username: "User 2",
                                                socketID: "",
                                        });
                                        const userNamesString = users[0].username;
                                        toast.info(`1 Room member : ${userNamesString}`, {
                                                position: "top-right",
                                        });
                                }
                                if (users.length == 2) {
                                        if (users[0].username == username) {
                                                setMe(users[0]);
                                                setOtherUser(users[1]);
                                        } else {
                                                setMe(users[1]);
                                                setOtherUser(users[0]);
                                        }
                                        const userNamesString = users[0].username + " and " + users[1].username;
                                        toast.info(`2 Room members : ${userNamesString}`, {
                                                position: "top-right",
                                        });
                                }
                        });
                socket &&
                        socket.on("roomFull", () => {
                                toast.warn("The room is already full");
                                navigate("/room");
                        });

                return () => {
                        socket && socket.off("getUserDetails");
                        socket && socket.off("roomFull");
                };
        }, [socket]);

        useEffect(() => {
                socket && socket.emit("languageChange", { language: "cpp", roomID: roomID });
        }, []);

        useEffect(() => {
                socket &&
                        socket.on("codeUpdate", ({ code }) => {
                                dispatch(updateCode(code));
                        });

                socket &&
                        socket.on("inputUpdate", ({ userInput }) => {
                                dispatch(updateUserInput(userInput));
                        });
                socket &&
                        socket.on("languageChange", ({ language }) => {
                                dispatch(updateLanguage(language));
                        });

                return () => {
                        socket && socket.off("codeUpdate");
                        socket && socket.off("inputUpdate");
                        socket && socket.off("languageChange");
                };
        }, [socket]);
        useEffect(() => {
                return () => {
                        if (myStream) {
                                myStream.getTracks().forEach((track) => {
                                        track.stop();
                                });
                        }
                        if (socket) {
                                socket.emit("endVideoCall", { to: otherUser.socketID });
                        }
                };
        }, []);
        //Video Call Logic
        const [myStream, setMyStream] = useState();
        const [otherStream, setOtherStream] = useState();
        const [acceptCallButton, setAcceptCallButton] = useState(false);
        const [endCall, setEndCall] = useState(false);

        const startVideoCall = useCallback(async () => {
                if (otherUser.username === "User 2") {
                        toast.warn("Wait for second person to join !");
                } else {
                        setEndCall(true);
                        console.log("starting video call ... ");
                        setAcceptCallButton(false);
                        toast.info("Starting Video Call", { position: "top-right" });

                        const stream = await navigator.mediaDevices.getUserMedia({
                                audio: true,
                                video: true,
                        });

                        const offer = await peer.getOffer();
                        socket.emit("startCall", { to: otherUser.socketID, offer });
                        stream && setMyStream(stream);
                }
        }, [otherUser.socketID, socket]);
        function endVideoCall() {
                setEndCall(false);
                setAcceptCallButton(false);
                console.log("ending video call ...");
                if (myStream) {
                        myStream.getTracks().forEach((track) => {
                                track.stop();
                        });
                }
                if (otherStream) {
                        otherStream.getTracks().forEach((track) => {
                                track.stop();
                        });
                }
                peer.setLocalDescription("endCall");
                setMyStream(null);
                setOtherStream(null);
                socket && socket.emit("endVideoCall", { to: otherUser.socketID });
                toast.info("Ending Video Call", { position: "top-right" });
        }

        const incommingCall = useCallback(
                async ({ from, offer }) => {
                        if (!endCall) {
                                setAcceptCallButton(true);
                        }

                        const stream = await navigator.mediaDevices.getUserMedia({
                                audio: true,
                                video: true,
                        });
                        const videoTracks = stream.getVideoTracks();
                        const videoStream = new MediaStream(videoTracks);
                        setMyStream(videoStream);
                        const answer = await peer.getAnswer(offer);
                        socket.emit("callAccepted", { to: from, answer });
                },
                [socket]
        );

        const sendStreams = useCallback(() => {
                for (const track of myStream.getTracks()) {
                        peer.peer.addTrack(track, myStream);
                }
        }, [myStream]);

        const handleCallAccepted = useCallback(
                ({ from, answer }) => {
                        peer.setLocalDescription(answer);
                        sendStreams();
                },
                [sendStreams]
        );

        const handleEndCall = useCallback(() => {
                if (myStream) {
                        myStream.getTracks().forEach((track) => {
                                track.stop();
                        });
                }
                if (otherStream) {
                        otherStream.getTracks().forEach((track) => {
                                track.stop();
                        });
                }
                setOtherStream(null);
                setMyStream(null);
                setEndCall(false);
                setAcceptCallButton(false);
                peer.setLocalDescription("endCall");
        });

        const handleNegoNeeded = useCallback(async () => {
                const offer = await peer.getOffer();
                socket.emit("peer:nego:needed", { offer, to: otherUser.socketID });
        }, [otherUser.socketID, socket]);

        useEffect(() => {
                peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
                return () => {
                        peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
                };
        }, [handleNegoNeeded]);

        const handleNegoNeedIncomming = useCallback(
                async ({ from, offer }) => {
                        const answer = await peer.getAnswer(offer);
                        socket.emit("peer:nego:done", { to: from, answer });
                },
                [socket]
        );

        const handleNegoNeedFinal = useCallback(async ({ answer }) => {
                await peer.setLocalDescription(answer);
        }, []);

        useEffect(() => {
                peer.peer.addEventListener("track", async (ev) => {
                        const remoteStream = ev.streams;
                        console.log("GOT TRACKS!!");
                        setOtherStream(remoteStream[0]);
                });
        }, []);

        useEffect(() => {
                socket && socket.on("incommingCall", incommingCall);
                socket && socket.on("callAccepted", handleCallAccepted);
                socket && socket.on("peer:nego:needed", handleNegoNeedIncomming);
                socket && socket.on("peer:nego:final", handleNegoNeedFinal);
                socket && socket.on("endVideoCall", handleEndCall);
                return () => {
                        socket && socket.off("incommingCall");
                        socket && socket.off("callAccepted");
                        socket && socket.off("peer:nego:needed");
                        socket && socket.off("peer:nego:final");
                        socket && socket.off("endVideoCall");
                };
        }, [socket, incommingCall, handleCallAccepted, handleNegoNeedFinal, handleNegoNeedIncomming, handleEndCall]);
        const [screen, setScreen] = useState(window.screen.width);
        window.addEventListener("resize", handleResize);
        function handleResize() {
                setScreen(window.screen.width);
        }

        return (
                <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
                        <Header />
                        <main className="flex-1 flex overflow-hidden pt-16">
                                {!isLoggedIn() ? (
                                        <div className="flex-1 flex items-center justify-center bg-black/50 backdrop-blur-sm absolute inset-0 z-50">
                                                <div className="bg-card p-8 rounded-lg border border-border shadow-lg text-center space-y-4 max-w-md">
                                                        <h2 className="text-xl font-semibold">Join the collaboration</h2>
                                                        <p className="text-muted-foreground">Please log in to participate.</p>
                                                        <Register />
                                                </div>
                                        </div>
                                ) : (
                                        <div className="flex w-full h-full">
                                                {/* Editor Section */}
                                                <div className="flex-1 flex flex-col min-w-0 border-r border-border">
                                                        <div className="h-14 border-b border-border bg-muted/20">
                                                                <NavBar socket={socket} roomID={roomID} />
                                                        </div>
                                                        <div className="flex-1 relative">
                                                                <CodeEditor
                                                                        socket={socket}
                                                                        roomID={roomID}
                                                                        users={users}
                                                                />
                                                        </div>
                                                </div>

                                                {/* Sidebar Section (Video + IO) */}
                                                <div className="w-[400px] flex flex-col bg-muted/10">
                                                        {/* Video Section */}
                                                        <div className="h-[250px] p-2 gap-2 grid grid-cols-2 border-b border-border">
                                                                <div className="bg-black/90 rounded-md overflow-hidden relative flex items-center justify-center border border-border">
                                                                        {!myStream && !otherStream ? (
                                                                                <span className="text-muted-foreground text-xs">{me?.username || "You"}</span>
                                                                        ) : (
                                                                                myStream && <ReactPlayer playing height="100%" width="100%" url={myStream} muted />
                                                                        )}
                                                                </div>
                                                                <div className="bg-black/90 rounded-md overflow-hidden relative flex items-center justify-center border border-border">
                                                                        {!otherStream ? (
                                                                                <span className="text-muted-foreground text-xs">{otherUser?.username || "Waiting..."}</span>
                                                                        ) : (
                                                                                <ReactPlayer playing height="100%" width="100%" url={otherStream} />
                                                                        )}
                                                                </div>
                                                        </div>

                                                        {/* Controls */}
                                                        <div className="p-2 border-b border-border flex flex-wrap gap-2 justify-center">
                                                                {endCall ? (
                                                                        <button onClick={endVideoCall} className="px-3 py-1 bg-destructive text-destructive-foreground rounded-md text-sm hover:bg-destructive/90 transition-colors">
                                                                                End Call
                                                                        </button>
                                                                ) : acceptCallButton ? (
                                                                        <button onClick={startVideoCall} className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors">
                                                                                Accept
                                                                        </button>
                                                                ) : (
                                                                        <button onClick={startVideoCall} className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
                                                                                Video Call
                                                                        </button>
                                                                )}
                                                                <button onClick={leaveRoom} className="px-3 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-md text-sm transition-colors border border-border">
                                                                        Leave
                                                                </button>
                                                                <CopyToClipboard text={roomID} onCopy={() => toast.success("Copied Room ID!")}>
                                                                        <button className="px-3 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-md text-sm transition-colors border border-border flex items-center gap-2">
                                                                                {roomID} <i className="fa-solid fa-copy"></i>
                                                                        </button>
                                                                </CopyToClipboard>
                                                        </div>

                                                        {/* IO Windows */}
                                                        <div className="flex-1 flex flex-col min-h-0 p-2 gap-2">
                                                                <div className="flex-1 min-h-0">
                                                                        <InputWindow socket={socket} roomID={roomID} />
                                                                </div>
                                                                <div className="flex-1 min-h-0">
                                                                        <OutputWindow />
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                )}
                        </main>
                </div>
        );
};

export default CodeRoom;
