import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence} from "motion/react"
import * as Motion from "motion/react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

function TooltipWrapper({children, tooltip, icon}) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const ref = useRef(null);
    const timeoutRef = useRef(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => { // Adds a delay before showing the tooltip
            const rect = ref.current.getBoundingClientRect();
            setPosition({
                top: rect.top + window.scrollY - 30, // 30px above elements top side
                left: rect.left + window.scrollX, // half of an element to the right
            });
            setVisible(true);
        }, 100);
    };

    const hideTooltip = () => {
        clearTimeout(timeoutRef.current);
        setVisible(false);
    };

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current); // Cleanup on unmount
    }, []);

    return (
        <div>
            <div
                ref={ref}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                className="relative"
            >
                {children}
            </div>

            {visible &&
            createPortal(
                <AnimatePresence>
                    <Motion.motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute z-[9999] flex items-center gap-2 bg-text-primary text-background-primary small-button-shadow text-xs rounded px-2 py-1 whitespace-nowrap"
                        style={{
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            transform: "translateX(-50%)",
                            position: "absolute",
                        }}
                    >
                        {icon == 'link' ? (
                            <ArrowTopRightOnSquareIcon className="w-3 h-3 stroke-2"/>
                        ) : null}
                        {tooltip}
                    </Motion.motion.div>
                </AnimatePresence>,
                document.body
            )}

            {/* <AnimatePresence>
                {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute z-50 bg-background-primary text-text-primary small-button-shadow border border-border-dark text-xs rounded px-2 py-1 mt-1 left-1/2 transform -top-full whitespace-nowrap"
                >
                    {tooltip}
                </motion.div>
                )}
            </AnimatePresence> */}
        </div>
    );
}

export default TooltipWrapper;