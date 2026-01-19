import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const Sheet = ({ isOpen, onClose, children, className, side = "right" }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => (document.body.style.overflow = "unset")
    }, [isOpen])

    const variants = {
        open: { x: 0, opacity: 1 },
        closed: { x: side === "right" ? "100%" : "-100%", opacity: 0.5 },
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />
                    {/* Panel */}
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={variants}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className={cn(
                            "fixed z-50 h-full w-3/4 gap-4 bg-background p-6 shadow-lg border-l border-border sm:max-w-sm",
                            side === "right" ? "right-0 top-0" : "left-0 top-0",
                            className
                        )}
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export { Sheet }
