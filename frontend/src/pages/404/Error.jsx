/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { AlertTriangle } from "lucide-react";

function ErrorPage() {
        return (
                <div className="min-h-screen bg-background flex flex-col">
                        <Header />
                        <main className="flex-1 flex items-center justify-center p-6">
                                <div className="text-center space-y-6 max-w-md mx-auto">
                                        <div className="flex justify-center">
                                                <div className="p-4 rounded-full bg-muted">
                                                        <AlertTriangle className="h-12 w-12 text-yellow-500" />
                                                </div>
                                        </div>
                                        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                                                404 Not Found
                                        </h1>
                                        <p className="text-xl text-muted-foreground">
                                                Oops, this page doesn't exist.
                                        </p>
                                        <div className="pt-4">
                                                <Button asChild size="lg">
                                                        <Link to="/">Go back home</Link>
                                                </Button>
                                        </div>
                                </div>
                        </main>
                        <Footer />
                </div>
        );
}

export default ErrorPage;
