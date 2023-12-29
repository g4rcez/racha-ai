import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
    text: string[];
    ms: number;
};

export const TextRotator = (props: Props) => {
    const [active, setActive] = useState(props.text[0]);
    useEffect(() => {
        const interval = setInterval(() => {
            setActive(prev => {
                const index = props.text.indexOf(prev)
                const i = index + 1 > props.text.length - 1? 0 : index + 1;
                return props.text.at(i) || props.text[0];
            })
        }, props.ms)
        return () => clearInterval(interval)
    }, [props.ms, props.text]);

    return <span className="relative block w-full text-center h-4 mb-12 bg-red">
        <AnimatePresence mode="wait" presenceAffectsLayout>
        {props.text.map(x => x === active ? <motion.span className="absolute block text-left text-balance leading-snug lg:whitespace-nowrap -top-1 left-0" animate={{opacity:1}} exit={{opacity: 0.1, mode: "spring" }} key={`rotator-${x}`}>{x}</motion.span>: null)}
    </AnimatePresence>
    </span>

}