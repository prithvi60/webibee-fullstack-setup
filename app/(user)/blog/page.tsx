import Blogs from '@/components/layout/blog page/Blogs'
import React from 'react'

const Page = async () => {
    // const posts = await client.fetch(
    //     POSTS_QUERY,
    //     {},
    //     {
    //         cache: "no-cache",
    //         next: {
    //             tags: ["post"],
    //         },
    //     }
    // );

    return (
        <div>
            <Blogs posts={[]} />
        </div>
    )
}

export default Page
