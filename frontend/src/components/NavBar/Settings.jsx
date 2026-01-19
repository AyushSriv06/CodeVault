import React from "react";
import { Button } from "../ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateEditorTheme } from "../../redux/slices/editorThemeSlice";
import { updateFont } from "../../redux/slices/fontSlice";
import { updateTabSize } from "../../redux/slices/tabSizeSlice";
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
} from "../ui/dialog";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

const Settings = () => {
        const font = useSelector((state) => state.font?.value);
        const editorTheme = useSelector((state) => state.editorTheme?.value);
        const tabSize = useSelector((state) => state.tabSize?.value);
        const dispatch = useDispatch();

        const fontSizes = ["12px", "14px", "16px", "18px", "20px", "22px", "24px"];
        const tabSizes = [2, 4];
        const themeOptions = [
                { value: "monokai", name: "Monokai" },
                { value: "github", name: "GitHub" },
                { value: "tomorrow", name: "Tomorrow" },
                { value: "kuroir", name: "Kuroir" },
                { value: "twilight", name: "Twilight" },
                { value: "xcode", name: "Xcode" },
                { value: "solarized_dark", name: "Solarized Dark" },
                { value: "solarized_light", name: "Solarized Light" },
                { value: "terminal", name: "Terminal" },
        ];

        return (
                <Dialog>
                        <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100">
                                        <SettingsIcon className="h-5 w-5" />
                                </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
                                <DialogHeader>
                                        <DialogTitle>Editor Settings</DialogTitle>
                                        <DialogDescription className="text-zinc-400">
                                                Customize your coding environment.
                                        </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="font" className="text-right text-zinc-300">
                                                        Font Size
                                                </Label>
                                                <Select
                                                        value={font}
                                                        onValueChange={(val) => dispatch(updateFont(val))}
                                                >
                                                        <SelectTrigger className="col-span-3 bg-zinc-900 border-zinc-700 text-zinc-100">
                                                                <SelectValue placeholder="Select font size" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                                                                {fontSizes.map((size) => (
                                                                        <SelectItem key={size} value={size}>
                                                                                {size}
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="theme" className="text-right text-zinc-300">
                                                        Theme
                                                </Label>
                                                <Select
                                                        value={editorTheme}
                                                        onValueChange={(val) => dispatch(updateEditorTheme(val))}
                                                >
                                                        <SelectTrigger className="col-span-3 bg-zinc-900 border-zinc-700 text-zinc-100">
                                                                <SelectValue placeholder="Select theme" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100 h-[200px]">
                                                                {themeOptions.map((theme) => (
                                                                        <SelectItem key={theme.value} value={theme.value}>
                                                                                {theme.name}
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="tabSize" className="text-right text-zinc-300">
                                                        Tab Size
                                                </Label>
                                                <Select
                                                        value={tabSize?.toString()}
                                                        onValueChange={(val) => dispatch(updateTabSize(Number(val)))}
                                                >
                                                        <SelectTrigger className="col-span-3 bg-zinc-900 border-zinc-700 text-zinc-100">
                                                                <SelectValue placeholder="Select tab size" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                                                                {tabSizes.map((size) => (
                                                                        <SelectItem key={size} value={size.toString()}>
                                                                                {size} Spaces
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                        </div>
                                </div>
                        </DialogContent>
                </Dialog>
        );
};

export default Settings;
