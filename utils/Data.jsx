import {
    FaFacebook,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa6";

export const navLinks = [
    { menu: "home", link: "/" },
    { menu: "about", link: "/about" },
    {
        menu: "services",
        subMenus: [
            { menu: "service 1", link: "/services/service-1" },
            { menu: "service 2", link: "/services/service-2" },
        ],
    },
    { menu: "blog", link: "/blog" },
];

export const footerLinks1 = [
    { menu: "Home", href: "/" },
    { menu: "About", href: "/about" },
    { menu: "Contact Us", href: "/contact" },
];

export const footerLinks2 = [
    { menu: "service 1", href: "/services/service-1" },
    { menu: "service 2", href: "/services/service-2" },
    { menu: "blog", href: "/blog" },
];

export const socialLinks = [
    {
        icon: (
            <FaInstagram className="text-xl md:text-3xl text-black hover:text-black/70 hover:animate-pulse" />
        ),
        href: "#",
    },
    {
        icon: (
            <FaLinkedinIn className="text-xl md:text-3xl text-black hover:text-black/70 hover:animate-pulse" />
        ),
        href: "#",
    },
    {
        icon: (
            <FaFacebook className="text-xl md:text-3xl text-black hover:text-black/70 hover:animate-pulse" />
        ),
        href: "#",
    },
];
