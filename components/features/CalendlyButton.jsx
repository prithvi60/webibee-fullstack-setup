"use client";
import { useEffect, useState } from "react";
import NeuFollowButton from "../UI/NeuFollowButton";

const CalendlyLink = ({ type }) => {
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

    const handleCalendlyClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAppleDevice()) {
            // Redirect to Calendly URL for Apple devices
            window.location.href = url;
        } else {
            // Use popup for non-Apple devices
            if (window.Calendly && isScriptLoaded) {
                window.Calendly.initPopupWidget({ url });
            } else {
                console.error("Calendly not ready. Script loaded:", isScriptLoaded);
                setTimeout(() => {
                    if (window.Calendly) {
                        window.Calendly.initPopupWidget({ url });
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
                transform,
            }}
            onClick={handleCalendlyClick}
            className={`bg-black font-bold transition-all duration-300 rounded-lg border-2 border-solid border-white text-white cursor-pointer text-sm md:text-base hover:scale-110 shadow-xl px-3 py-2 md:py-3.5 md:px-5`}
        >
            Book a meeting
        </button>
    );
};

export default CalendlyLink;
