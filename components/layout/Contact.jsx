import React from "react";
import { FaPhone } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import { ContactForm } from "@/components/features/ContactForm";

const Contact = () => {
    return (
        <section className="w-full relative padding flex flex-col gap-20 md:gap-0 md:flex-row items-start justify-between max-w-5xl mx-auto">
            <div className="w-full md:w-3/5 space-y-5">
                <div className="space-y-3">
                    <h5 className="text-text text-2xl md:text-3xl">Get in touch</h5>
                    <p className="text-base md:text-lg">
                        We are here for you! How can we help?
                    </p>
                </div>
                <ContactForm />
            </div>
            <div className="space-y-4 md:space-y-10 w-full md:w-2/5">
                <div className="space-y-3">
                    <p className="text-sm flex justify-center md:justify-start items-center gap-2">
                        <span>
                            <FaPhone className="text-lg shrink-0 text-text" />
                        </span>
                        91-911110000
                    </p>
                    <p className="text-sm flex justify-center md:justify-start items-center gap-2">
                        <span>
                            <CiMail className="text-xl shrink-0 text-text" />
                        </span>
                        support@webibee.com
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Contact;
