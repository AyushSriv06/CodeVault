import * as React from "react"
import { cn } from "../../lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const DropdownMenu = ({ open, onOpenChange, trigger, children, align = "end" }) => {
    const ref = React.useRef(null)

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onOpenChange(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [onOpenChange])

    return (
        <div className="relative inline-block text-left" ref={ref}>
            <div onClick={() => onOpenChange(!open)}>
                {trigger}
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.1 }}
                        className={cn(
                            "absolute z-50 mt-2 w-56 origin-top-right rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none",
                            align === "end" ? "right-0" : "left-0"
                        )}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const DropdownMenuItem = ({ children, className, onClick, ...props }) => {
    return (
        <div
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            onClick={(e) => {
                onClick && onClick(e);
            }}
            {...props}
        >
            {children}
        </div>
    )
}

const DropdownMenuSeparator = ({ className, ...props }) => (
    <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
)

const DropdownMenuLabel = ({ className, ...props }) => (
    <div
        className={cn("px-2 py-1.5 text-sm font-semibold", className)}
        {...props}
    />
)

export {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
}
