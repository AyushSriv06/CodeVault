/* eslint-disable no-inner-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import { getUserData } from "../../services/getUserData";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Loading from "../../components/Loading/Loading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { User, Mail, Calendar } from "lucide-react";

const Settings = () => {
        const [user, setUser] = useState(null);
        useEffect(() => {
                if (isLoggedIn()) {
                        const email = localStorage.getItem("email");
                        async function handle() {
                                const res = await getUserData(email);
                                setUser(res.data);
                        }
                        handle();
                }
        }, []);

        function getDaysSince(dateString) {
                const currentDate = new Date();
                const createDate = new Date(dateString);
                const differenceMs = currentDate - createDate;
                const daysSince = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
                return daysSince;
        }

        return (
                <div className="min-h-screen bg-background flex flex-col">
                        <Header />

                        <main className="flex-1 container mx-auto px-4 py-8 mt-16 flex justify-center">
                                {user ? (
                                        <Card className="w-full max-w-lg mt-8 border-border bg-card">
                                                <CardHeader className="flex flex-col items-center space-y-4 pb-6 border-b border-border">
                                                        <img
                                                                className="h-24 w-24 rounded-full border-4 border-muted shadow-sm"
                                                                src={`https://ui-avatars.com/api/?name=${user.email.charAt(0)}&background=random`}
                                                                alt="userProfile"
                                                        />
                                                        <div className="text-center space-y-1">
                                                                <CardTitle className="text-2xl">{user.username}</CardTitle>
                                                                <CardDescription>{user.email}</CardDescription>
                                                        </div>
                                                </CardHeader>
                                                <CardContent className="space-y-6 pt-6">
                                                        <div className="grid gap-4">
                                                                <div className="flex items-center space-x-4 p-4 rounded-md border border-border bg-muted/40">
                                                                        <User className="h-5 w-5 text-muted-foreground" />
                                                                        <div className="flex-1 space-y-1">
                                                                                <p className="text-sm font-medium leading-none">Username</p>
                                                                                <p className="text-sm text-muted-foreground">{user.username}</p>
                                                                        </div>
                                                                </div>

                                                                <div className="flex items-center space-x-4 p-4 rounded-md border border-border bg-muted/40">
                                                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                                                        <div className="flex-1 space-y-1">
                                                                                <p className="text-sm font-medium leading-none">Email</p>
                                                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                                                        </div>
                                                                </div>

                                                                <div className="flex items-center space-x-4 p-4 rounded-md border border-border bg-muted/40">
                                                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                                                        <div className="flex-1 space-y-1">
                                                                                <p className="text-sm font-medium leading-none">Member Since</p>
                                                                                <p className="text-sm text-muted-foreground">{getDaysSince(user.createdAt)} days ago</p>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </CardContent>
                                        </Card>
                                ) : (
                                        <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
                                                <Loading />
                                        </div>
                                )}
                        </main>

                        <Footer />
                </div>
        );
};

export default Settings;
