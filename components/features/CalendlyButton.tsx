"use client";
import { useEffect, useState } from "react";

// Extend the Window interface to include the Calendly property
declare global {
    interface Window {
        Calendly?: {
            initPopupWidget: (options: { url: string }) => void;
        };
    }
}

interface CalendlyLinkProps {
    type: string;
}

const CalendlyLink = ({ type }: CalendlyLinkProps) => {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const url = process.env.NEXT_PUBLIC_CALENDLY_ID;

    useEffect(() => {
        const existingScript = document.querySelector(
            'script[src="https://assets.calendly.com/assets/external/widget.js"]'
        );

        if (existingScript) {
            setIsScriptLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.onload = () => setIsScriptLoaded(true);
        script.onerror = () => console.error("Failed to load Calendly script");
        document.body.appendChild(script);

        return () => { };
    }, []);

    // Function to detect if the device is an Apple device
    const isAppleDevice = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /(iphone|ipad|ipod|macintosh)/i.test(userAgent);
    };

    interface HandleCalendlyClickEvent extends React.MouseEvent<HTMLButtonElement> { }

    const handleCalendlyClick = (e: HandleCalendlyClickEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        if (isAppleDevice()) {
            // Redirect to Calendly URL for Apple devices
            window.location.href = url as string;
        } else {
            // Use popup for non-Apple devices
            if (window.Calendly && isScriptLoaded) {
                window.Calendly.initPopupWidget({ url: url as string });
            } else {
                console.error("Calendly not ready. Script loaded:", isScriptLoaded);
                setTimeout(() => {
                    if (window.Calendly) {
                        window.Calendly.initPopupWidget({ url: url as string });
                    } else {
                        alert("Unable to load Calendly. Please try again later.");
                    }
                }, 500);
            }
        }
    };

    return (
        <button
            style={{
                transform: "scale(1)", // Replace with a valid CSS transform value
            }}
            onClick={handleCalendlyClick}
            className={`bg-black font-bold transition-all duration-300 rounded-lg border-2 border-solid border-white text-white cursor-pointer text-sm md:text-base hover:scale-110 shadow-xl px-3 py-2 md:py-3.5 md:px-5`}
        >
            Book a meeting
        </button>
    );
};

export default CalendlyLink;
