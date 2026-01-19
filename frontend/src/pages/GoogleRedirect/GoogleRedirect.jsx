/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link, useLocation } from "react-router-dom";
import { handlegoogleRedirect } from "../../services/getGoogleAuth";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

function GoogleRedirect() {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const code = params.get("code");

        useEffect(() => {
                handlegoogleRedirect(code);
        }, []);

        return (
                <div className="min-h-screen bg-background flex flex-col">
                        <Header />
                        <main className="flex-1 flex items-center justify-center p-6">
                                <div className="container max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
                                        <div className="space-y-8 text-center lg:text-left">
                                                <div className="space-y-4">
                                                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl xl:text-6xl text-primary">
                                                                CodeVault
                                                        </h1>
                                                        <p className="text-xl text-muted-foreground lg:text-2xl">
                                                                A better way to level up your coding skills.
                                                        </p>
                                                </div>

                                                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                                        <Button asChild size="lg" className="rounded-full px-8">
                                                                <Link to="/practiceproblems">Practice Problems</Link>
                                                        </Button>
                                                        <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                                                                <Link to="/onlinecompiler">Online Compiler</Link>
                                                        </Button>
                                                        <Button asChild variant="ghost" size="lg" className="rounded-full px-8">
                                                                <Link to="/room">Code Room</Link>
                                                        </Button>
                                                </div>
                                        </div>

                                        <div className="hidden lg:block relative">
                                                {/* Placeholder for the tree image if you want to keep it, otherwise removed or replaced */}
                                                <div className="aspect-square bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-50 absolute inset-0" />
                                                <img
                                                        src="/Home-Page-Tree.svg"
                                                        alt="Coding Tree"
                                                        className="relative z-10 w-full drop-shadow-2xl"
                                                />
                                        </div>
                                </div>
                        </main>
                        <Footer />
                </div>
        );
}

export default GoogleRedirect;
