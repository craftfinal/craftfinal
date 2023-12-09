import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";

function PostCard(post: Post) {
  return (
    <div className="mb-8">
      <h2 className="mb-1">
        <Link href={post.url}>{post.title}</Link>
      </h2>
      <time dateTime={post.date} className="mb-2 block text-xs text-gray-600">
        {format(parseISO(post.date), "LLLL d, yyyy")}
      </time>
      <div className="text-sm [&>*:last-child]:mb-0 [&>*]:mb-3" dangerouslySetInnerHTML={{ __html: post.body.html }} />
    </div>
  );
}

export default function Home() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <article className="prose dark:prose-invert lg:prose-xl">
      <h1>Next.js + Contentlayer Example</h1>
      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </article>
  );
}
