import Link from "next/link";

export const GetStartButton = ({ text, href }) => {
    return (
        <Link
            title={`${text} page`}
            href={href}
            className="rounded-lg border-2 border-solid border-white bg-black px-2 py-2 md:py-3 md:px-4 font-semibold capitalize text-white text-sm transition-all duration-300 hover:scale-110"
        >
            {text}
        </Link>
    );
};
