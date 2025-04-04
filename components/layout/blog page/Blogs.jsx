import Image from "next/image";
import Link from "next/link";
import React from "react";

const Blogs = ({ posts }) => {
    const publishedAt = posts.map((val) => val.publishedAt);
    const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    return (
        <section className="padding w-full space-y-24 md:space-y-36">
            <div className="w-full space-y-10 md:space-y-16">
                <h4 className="text-3xl sm:text-4xl lg:text-[60px] font-semibold text-center">
                    Read more Interesting Blog
                </h4>
                <div className="grid grid-cols-1 max-w-xs mx-auto sm:max-w-full md:grid-cols-2 place-content-center place-items-center xl:grid-cols-3 gap-8">
                    {posts.map((item, idx) => (
                        <Link title="blog post page"
                            href={`/blog/${item.slug.current}`}
                            key={idx}
                            className="rounded-lg shadow-lg overflow-hidden hover:scale-110 duration-300 ease-in-out transition-all cursor-pointer w-full max-w-[450px]"
                        >
                            <div className="w-full h-60 overflow-hidden relative">
                                <Image
                                    title={item.imageAlt}
                                    src={item.imageUrl}
                                    alt={item.imageAlt}
                                    fill
                                    className="object-cover object-center rounded-t-lg"
                                />
                            </div>
                            <div className="p-3.5 space-y-4">
                                <p className="text-lg md:text-xl font-semibold tracking-wide line-clamp-2">
                                    {item.blogShortRead}
                                </p>
                                <div className="flex justify-between items-center">
                                    <h5 className="text-base font-medium tracking-wider md:text-lg">
                                        {formattedDate}
                                    </h5>
                                    <p className="text-sm tracking-wide underline underline-offset-2">
                                        {"Read more ->"}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blogs;

