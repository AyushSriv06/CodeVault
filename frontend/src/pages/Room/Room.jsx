/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import Register from "../../components/Login/Register";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Users, LogIn } from "lucide-react";

const Room = () => {
        const navigate = useNavigate();
        const [roomIdInput, setRoomIdInput] = useState("");

        function hostClick() {
                const roomID = Math.random().toString(36).substring(7);
                navigate(`/room/${roomID}`);
        }

        function joinClick() {
                if (roomIdInput.trim()) {
                        navigate(`/room/${roomIdInput}`);
                }
        }

        return (
                <div className="min-h-screen bg-background flex flex-col">
                        <Header />
                        <main className="flex-1 container mx-auto px-4 py-8 mt-16 flex items-center justify-center">
                                {!isLoggedIn() ? (
                                        <div className="flex flex-col items-center justify-center space-y-6 max-w-md text-center">
                                                <h2 className="text-2xl font-bold">Collaborate in Real-time</h2>
                                                <p className="text-muted-foreground">Please register or login to host or join a coding room.</p>
                                                {/* Register component handles the modal trigger internally now */}
                                                <div className="w-full">
                                                        <Register />
                                                </div>
                                        </div>
                                ) : (
                                        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                                                <Card className="flex flex-col justify-between border-border bg-card hover:bg-muted/20 transition-colors">
                                                        <CardHeader>
                                                                <CardTitle className="flex items-center gap-2">
                                                                        <Users className="h-6 w-6 text-primary" />
                                                                        Host a Room
                                                                </CardTitle>
                                                                <CardDescription>Create a new room and invite others to join.</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="pt-6">
                                                                <Button size="lg" className="w-full" onClick={hostClick}>
                                                                        Create New Room
                                                                </Button>
                                                        </CardContent>
                                                </Card>

                                                <Card className="flex flex-col justify-between border-border bg-card">
                                                        <CardHeader>
                                                                <CardTitle className="flex items-center gap-2">
                                                                        <LogIn className="h-6 w-6 text-primary" />
                                                                        Join a Room
                                                                </CardTitle>
                                                                <CardDescription>Enter a Room ID to join an existing session.</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4 pt-6">
                                                                <Input
                                                                        placeholder="Enter Room ID"
                                                                        value={roomIdInput}
                                                                        onChange={(e) => setRoomIdInput(e.target.value)}
                                                                        className="text-lg"
                                                                />
                                                                <Button size="lg" variant="secondary" className="w-full" onClick={joinClick}>
                                                                        Join Room
                                                                </Button>
                                                        </CardContent>
                                                </Card>
                                        </div>
                                )}
                        </main>
                        <Footer />
                </div>
        );
};

export default Room;
