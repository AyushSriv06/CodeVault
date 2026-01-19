/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
        DropdownMenu,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"; // Using Shadcn Avatar logic or standard img
import { LogOut, User, Settings as SettingsIcon, Code } from "lucide-react";

const Profile = () => {
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
        const email = localStorage.getItem("email");
        const username = localStorage.getItem("username");
        const firstLetter = email?.charAt(0).toUpperCase(); // Better fallback
        const avatarUrl = `https://ui-avatars.com/api/?name=${firstLetter}&background=random`;
        const frontendURL = import.meta.env.VITE_FRONTEND_URL;

        const handleLogout = () => {
                localStorage.clear();
                toast.success("Logging out...", { autoClose: 2000 });
                setTimeout(() => {
                        window.location.href = frontendURL || "/"; // Fallback to root if env not set
                }, 1000); // Faster redirect
        };

        return (
                <DropdownMenu
                        open={isDropdownOpen}
                        onOpenChange={setIsDropdownOpen}
                        trigger={
                                <button className="rounded-full border-2 border-transparent hover:border-primary transition-all focus:outline-none">
                                        <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary transition-all">
                                                <AvatarImage src={avatarUrl} alt="userProfile" />
                                                <AvatarFallback>{firstLetter}</AvatarFallback>
                                        </Avatar>
                                </button>
                        }
                >
                        <div className="px-2 py-1.5">
                                <p className="text-sm font-medium leading-none">{username}</p>
                                <p className="text-xs leading-none text-muted-foreground mt-1">{email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                                <Link to={"/submissions"} className="w-full flex items-center">
                                        <Code className="mr-2 h-4 w-4" />
                                        <span>Submissions</span>
                                </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                                <Link to={"/settings"} className="w-full flex items-center">
                                        <SettingsIcon className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-100/10">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                        </DropdownMenuItem>
                </DropdownMenu>
        );
};

export default Profile;
