import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import useMeasure from "react-use-measure";

export const Resizable = ({ children }: PropsWithChildren) => {
    const [ref, bounds] = useMeasure();
    return (
        <motion.div animate={{ height: bounds.height > 0 ? bounds.height : undefined }}>
            <div ref={ref}>{children}</div>
        </motion.div>
    );
};
