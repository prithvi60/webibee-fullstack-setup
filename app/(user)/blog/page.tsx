import Blogs from '@/components/layout/blog page/Blogs';
import { client } from '@/sanity/lib/client';
import { POSTS_QUERY } from '@/sanity/Queries';
import React from 'react'

const Page = async () => {
    const posts = await client.fetch(
        POSTS_QUERY,
        {},
        {
            cache: "no-cache",
            next: {
                tags: ["post"],
            },
        }
    );

    return (
        <div>
            <Blogs posts={posts} />
        </div>
    )
}

export default Page
