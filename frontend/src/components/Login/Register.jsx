import { useState } from "react";
import { signup, login } from "../../services/registerApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getGoogleAuth } from "../../services/getGoogleAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label"; // Assuming simple label or I will create inline

const Register = () => {
        const [userData, setUserData] = useState({
                username: "",
                email: "",
                password: "",
        });
        const [toggleRegister, setToggleRegister] = useState(false);
        const [activeButton, setActiveButton] = useState("login");

        const handleRegister = async (type) => {
                if (type === "signup") {
                        if (!userData.username) {
                                toast.warn("Username is required");
                                return;
                        }
                }
                if (!userData.email) {
                        toast.warn("Email is required");
                        return;
                } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
                        toast.warn("Invalid email format");
                        return;
                }
                if (!userData.password) {
                        toast.warn("Password is required");
                        return;
                } else if (userData.password.length < 6) {
                        toast.warn("Password must be at least 6 characters long");
                        return;
                }
                if (type === "signup") {
                        await signup(userData);
                }
                if (type === "login") {
                        await login(userData, "normal");
                }
        };

        const handleButtonClick = (buttonName) => {
                setActiveButton(buttonName);
        };

        const handleKeyDown = (event, type) => {
                if (event.key === "Enter") {
                        handleRegister(type);
                }
        };

        return (
                <>
                        <Button onClick={() => setToggleRegister(true)}>
                                Log In / Register
                        </Button>

                        <Dialog open={toggleRegister} onOpenChange={setToggleRegister}>
                                <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                                <DialogTitle className="text-center text-2xl">
                                                        {activeButton === "login" ? "Welcome Back" : "Create Account"}
                                                </DialogTitle>
                                                <DialogDescription className="text-center">
                                                        {activeButton === "login"
                                                                ? "Enter your credentials to access your account"
                                                                : "Enter your details to create a new account"}
                                                </DialogDescription>
                                        </DialogHeader>

                                        <div className="flex w-full mb-4 border rounded-md overflow-hidden">
                                                <button
                                                        className={`flex-1 py-2 text-sm font-medium transition-colors ${activeButton === "login"
                                                                        ? "bg-primary text-primary-foreground"
                                                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                                }`}
                                                        onClick={() => handleButtonClick("login")}
                                                >
                                                        Log In
                                                </button>
                                                <button
                                                        className={`flex-1 py-2 text-sm font-medium transition-colors ${activeButton === "signup"
                                                                        ? "bg-primary text-primary-foreground"
                                                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                                }`}
                                                        onClick={() => handleButtonClick("signup")}
                                                >
                                                        Sign Up
                                                </button>
                                        </div>

                                        <div className="grid gap-4 py-4">
                                                {activeButton === "signup" && (
                                                        <div className="grid gap-2">
                                                                <Label htmlFor="username">Username</Label>
                                                                <Input
                                                                        id="username"
                                                                        placeholder="johndoe"
                                                                        value={userData.username}
                                                                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                                                        onKeyDown={(e) => handleKeyDown(e, "signup")}
                                                                />
                                                        </div>
                                                )}
                                                <div className="grid gap-2">
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input
                                                                id="email"
                                                                type="email"
                                                                placeholder="name@example.com"
                                                                value={userData.email}
                                                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                                onKeyDown={(e) => handleKeyDown(e, activeButton)}
                                                        />
                                                </div>
                                                <div className="grid gap-2">
                                                        <Label htmlFor="password">Password</Label>
                                                        <Input
                                                                id="password"
                                                                type="password"
                                                                placeholder="••••••"
                                                                value={userData.password}
                                                                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                                                onKeyDown={(e) => handleKeyDown(e, activeButton)}
                                                        />
                                                </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                                <Button className="w-full" onClick={() => handleRegister(activeButton)}>
                                                        {activeButton === "login" ? "Log In" : "Sign Up"}
                                                </Button>

                                                <div className="relative">
                                                        <div className="absolute inset-0 flex items-center">
                                                                <span className="w-full border-t" />
                                                        </div>
                                                        <div className="relative flex justify-center text-xs uppercase">
                                                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                                        </div>
                                                </div>

                                                <Button variant="outline" className="w-full gap-2" onClick={getGoogleAuth}>
                                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                                                                <path
                                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                                        style={{ fill: "#4285F4" }}
                                                                />
                                                                <path
                                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                                        style={{ fill: "#34A853" }}
                                                                />
                                                                <path
                                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                                        style={{ fill: "#FBBC05" }}
                                                                />
                                                                <path
                                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                                        style={{ fill: "#EA4335" }}
                                                                />
                                                        </svg>
                                                        Google
                                                </Button>
                                        </div>
                                </DialogContent>
                        </Dialog>
                </>
        );
};
export default Register;
