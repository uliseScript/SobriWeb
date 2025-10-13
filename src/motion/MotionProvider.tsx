import { MotionConfig, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

export default function MotionProvider ({children} : PropsWithChildren){
    const prefersReduced = useReducedMotion();
    return(
        <MotionConfig
        reducedMotion={prefersReduced ? "always" : "never"}
        transition={{ type: "spring", stiffness: 380, damping: 280} }

        >
            {children}
        </MotionConfig>
    );
}