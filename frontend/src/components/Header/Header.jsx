/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet } from "../ui/sheet";
import { Menu, Terminal, Code2, Trophy, User } from "lucide-react";
import Register from "../Login/Register";
import Profile from "../Login/Profile";
import { isLoggedIn } from "../Login/isLoggedIn";

const Header = () => {
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const location = useLocation();
        const [scrolled, setScrolled] = useState(false);

        useEffect(() => {
                const handleScroll = () => {
                        setScrolled(window.scrollY > 20);
                };
                window.addEventListener("scroll", handleScroll);
                return () => window.removeEventListener("scroll", handleScroll);
        }, []);

        const navLinks = [
                { name: "Practice", path: "/practiceproblems", icon: <Code2 className="h-4 w-4 mr-2" /> },
                { name: "Compiler", path: "/onlinecompiler", icon: <Terminal className="h-4 w-4 mr-2" /> },
                { name: "Rooms", path: "/room", icon: <User className="h-4 w-4 mr-2" /> }, // Icon placeholder
                { name: "Leaderboard", path: "/leaderboard", icon: <Trophy className="h-4 w-4 mr-2" /> },
        ];

        return (
                <header className={`fixed top-0 z-50 w-full border-b border-white/10 transition-all duration-300 ${scrolled ? "bg-black/50 backdrop-blur-xl" : "bg-transparent"}`}>
                        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4 md:px-6">

                                {/* Logo */}
                                <div className="flex items-center gap-2">
                                        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                                        <Code2 className="h-5 w-5" />
                                                </div>
                                                <span className="hidden md:inline-block">CodeVault</span>
                                        </Link>
                                </div>

                                {/* Desktop Nav */}
                                <nav className="hidden md:flex items-center gap-1">
                                        {navLinks.map((link) => (
                                                <Link key={link.path} to={link.path}>
                                                        <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className={`text-zinc-400 hover:text-zinc-100 hover:bg-white/5 data-[active=true]:text-zinc-100 data-[active=true]:bg-white/10`}
                                                                data-active={location.pathname === link.path}
                                                        >
                                                                {link.icon}
                                                                {link.name}
                                                        </Button>
                                                </Link>
                                        ))}
                                </nav>

                                {/* Auth & Mobile Toggle */}
                                <div className="flex items-center gap-4">
                                        <div className="hidden md:flex">
                                                {isLoggedIn() ? <Profile /> : <Register />}
                                        </div>

                                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
                                                <Menu className="h-6 w-6" />
                                        </Button>
                                </div>
                        </div>

                        {/* Mobile Sheet */}
                        <Sheet isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} side="right">
                                <div className="flex flex-col gap-6 mt-8">
                                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">
                                                CodeVault
                                        </Link>
                                        <div className="flex flex-col gap-2">
                                                {navLinks.map((link) => (
                                                        <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)}>
                                                                <Button variant="ghost" className="w-full justify-start text-lg">
                                                                        {link.icon}
                                                                        {link.name}
                                                                </Button>
                                                        </Link>
                                                ))}
                                        </div>
                                        <div className="mt-4">
                                                {isLoggedIn() ? <Profile /> : <Register />}
                                        </div>
                                </div>
                        </Sheet>
                </header>
        );
};

export default Header;
