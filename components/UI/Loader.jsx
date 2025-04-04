"use client";
import { motion } from "framer-motion";

const Loader = ({ styles, type }) => {
    return (
        <div className="w-full">
            <BarLoader styles={styles} type={type} />
        </div>
    );
};

const variants = {
    initial: {
        scaleY: 0.5,
        opacity: 0,
    },
    animate: {
        scaleY: 1,
        opacity: 1,
        transition: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1,
            ease: "circIn",
        },
    },
};

const BarLoader = ({ styles, type }) => {
    return (
        <motion.div
            transition={{
                staggerChildren: 0.25,
            }}
            initial="initial"
            animate="animate"
            className="flex items-center justify-center gap-1"
        >
            <motion.div
                variants={variants}
                className={`w-2 h-6 ${type === "main" ? styles : "bg-white"}`}
            />
            <motion.div
                variants={variants}
                className={`w-2 h-6 ${type === "main" ? styles : "bg-white"}`}
            />
            <motion.div
                variants={variants}
                className={`w-2 h-6 ${type === "main" ? styles : "bg-white"}`}
            />
            <motion.div
                variants={variants}
                className={`w-2 h-6 ${type === "main" ? styles : "bg-white"}`}
            />
            <motion.div
                variants={variants}
                className={`w-2 h-6 ${type === "main" ? styles : "bg-white"}`}
            />
        </motion.div>
    );
};

export default Loader;
