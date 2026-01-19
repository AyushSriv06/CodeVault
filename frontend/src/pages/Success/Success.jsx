/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { CheckCircle2, UserCheck } from "lucide-react";

function Success() {
        const location = useLocation();
        const url = import.meta.env.VITE_FRONTEND_URL || "/";

        useEffect(() => {
                const params = new URLSearchParams(location.search);
                const token = params.get("token");
                const username = params.get("username");
                const email = params.get("email");

                // Set data in local storage
                if (token && username && email) {
                        localStorage.setItem("username", username);
                        localStorage.setItem("email", email);
                        localStorage.setItem("token", token);
                        toast.success(`Welcome back, ${username}. Redirecting...`, {
                                autoClose: 1500,
                                position: "bottom-right",
                        });
                } else {
                        // Registration failed, display error alert with reason
                        toast.warn("Login failed, please try again", {
                                autoClose: 1500,
                                position: "bottom-right",
                        });
                }

                const timer = setTimeout(() => {
                        window.location.href = url;
                }, 1700);

                return () => clearTimeout(timer);
        }, [location.search, url]);

        return (
                <div className="min-h-screen bg-background flex flex-col">
                        <Header />
                        <main className="flex-1 flex items-center justify-center p-6 bg-grid-white/[0.02]">
                                <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-sm shadow-xl">
                                        <CardContent className="flex flex-col items-center py-12 space-y-6 text-center">
                                                <div className="p-4 rounded-full bg-green-500/20 text-green-500">
                                                        <UserCheck className="w-12 h-12" />
                                                </div>

                                                <div className="space-y-2">
                                                        <h1 className="text-3xl font-bold tracking-tight">Login Successful!</h1>
                                                        <p className="text-muted-foreground text-lg">
                                                                Setting up your workspace...
                                                        </p>
                                                </div>

                                                <div className="flex justify-center pt-4">
                                                        <div className="flex gap-1">
                                                                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                                                                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                                                                <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                                                        </div>
                                                </div>

                                        </CardContent>
                                </Card>
                        </main>
                        <Footer />
                </div>
        );
}

export default Success;
