"use client";
import { useState } from "react";
import Loader from "../UI/Loader";

const initialFormData = {
    name: "",
    email: "",
    message: "",
};
export const ContactForm = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [status, setStatus] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(true);

        try {
            const emailResponse = await fetch("/api/sendMail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    title: "contact"
                }),
            });

            if (!emailResponse.ok) {
                const errorData = await emailResponse.text();
                throw new Error(
                    `Email API Error: ${emailResponse.status} ${errorData}`
                );
            }

            const emailDataResult = await emailResponse.json();

            // Check for success in both responses
            if (emailDataResult.success) {
                setStatus(false);
                setFormData(initialFormData);
                e.target.reset();
            }
        } catch (error) {
            console.error("Error sending emails:", error);
            setStatus(false);
        }
    };
    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="w-full md:w-[85%] lg:w-3/5 space-y-5"
            >
                <div className="gap-2 flex flex-col">
                    <label htmlFor="name" className="capitalize font-bold tracking-wider">
                        name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name || ""}
                        onChange={handleChange}
                        className="rounded-lg border-3 p-2 border-text focus-within:border-2 focus-within:border-text focus-within:outline-none"
                    />
                </div>
                <div className="gap-2 flex flex-col">
                    <label htmlFor="email" className="capitalize font-bold tracking-wider">
                        email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        required
                        className="rounded-lg border-3 p-2 border-text focus-within:border-2 focus-within:border-text focus-within:outline-none"
                    />
                </div>
                <div className="gap-2 flex flex-col">
                    <label htmlFor="message" className="capitalize font-bold tracking-wider">
                        message
                    </label>
                    <textarea
                        type="text"
                        id="message"
                        name="message"
                        value={formData.message || ""}
                        onChange={handleChange}
                        rows={3}
                        className="rounded-lg border-3 p-2 border-text focus-within:border-2 focus-within:border-text focus-within:outline-none"
                    />
                </div>
                <button
                    role="button"
                    aria-label="Submit Form"
                    type="submit"
                    className="rounded-lg border-2 border-solid border-white bg-black px-3.5 cursor-pointer py-2 md:py-3 md:px-5 font-semibold capitalize text-white text-sm transition-all duration-300 hover:scale-110"
                >
                    {status ? <Loader /> : "Submit"}
                </button>
            </form>
        </>
    );
};
