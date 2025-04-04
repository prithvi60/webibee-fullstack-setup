import Link from "next/link";
import { footerLinks1, footerLinks2, socialLinks } from "@/utils/Data";
import Image from "next/image";

const Footer = () => {

    return (
        <footer className={`padding relative space-y-6 md:space-y-10 w-full`}>
            <div
                className={`absolute -z-10 h-full inset-0 bg-radial from-gradient-1 to-gradient-2 sm:h-64 blur-3xl opacity-20 rounded-full rotate-[4deg] w-[90%] sm:m-auto`}
            />
            <div className="flex flex-col justify-center items-center lg:items-start lg:flex-row lg:justify-between gap-6 lg:gap-8 w-full">
                <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-y-6">
                    <Link
                        title="logo"
                        href={"/"}
                        className="flex items-center gap-2"
                    >
                        <Image title={"logo"}
                            src={"https://ik.imagekit.io/webibee/Webibee/webibeepurplelogo.png?updatedAt=1735897013322"}
                            alt="webibee logo" width={150} height={150} className="object-contain object-center" />
                    </Link>
                    <ul className="flex md:hidden items-center gap-2.5">
                        {socialLinks.map((list, idx) => (
                            <li key={idx} className="flex-shrink-0">
                                <Link title="footer social icons" href={list.href}>{list.icon}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="grid grid-cols-2 md:flex md:items-start md:justify-between md:flex-row gap-x-0 gap-y-10 md:gap-12">
                    <div className="block space-y-3">
                        {/* <h4 className="text-lg font-medium capitalize tracking-wider md:text-xl">
                            Helpful Links
                        </h4> */}
                        <ul className="block space-y-2.5 md:space-y-4">
                            {footerLinks1.map((list, idx) => (
                                <li
                                    key={idx}
                                    className={`text-sm capitalize md:text-base tracking-wide font-medium`}
                                >
                                    <Link title={list.menu} href={list.href}>{list.menu}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="block space-y-3">
                        {/* <h4 className="text-lg font-medium capitalize tracking-wider md:text-xl">
                            Topics & Types
                        </h4> */}
                        <ul className="block space-y-2.5 md:space-y-4">
                            {footerLinks2.map((list, idx) => (
                                <li
                                    key={idx}
                                    className={`text-sm capitalize md:text-base tracking-wide font-medium`}
                                >
                                    <Link title={list.menu} href={list.href}>{list.menu}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className={`flex flex-col justify-center items-center lg:flex-row lg:justify-between gap-8 font-medium`}>
                <ul className="hidden md:flex items-center gap-2.5">
                    {socialLinks.map((list, idx) => (
                        <li key={idx} className="flex-shrink-0">
                            <Link title="icons" href={list.href}>{list.icon}</Link>
                        </li>
                    ))}
                </ul>
                <p className="text-sm text-center capitalize font-medium lg:text-start md:text-base">
                    © {new Date().getFullYear()} <span className="text-text font-semibold">business portfolio</span>{" "}. All rights reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;
