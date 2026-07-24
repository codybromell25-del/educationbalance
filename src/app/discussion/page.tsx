import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import PostForm from "./PostForm";
import ReplyForm from "./ReplyForm";
import DeleteButton from "./DeleteButton";

const DATE_FMT: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export default async function DiscussionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const currentUserId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  // Top-level posts newest first, replies nested oldest first so the
  // conversation reads top-to-bottom.
  const posts = await prisma.discussionPost.findMany({
    where: { parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, role: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, role: true } },
        },
      },
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-6 py-10 md:py-14">
      <header className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-2">
          Discussion
        </p>
        <h1 className="text-3xl md:text-4xl font-light text-brand-primary">
          The board
        </h1>
        <p className="mt-3 text-sm text-brand-muted">
          Open to everyone on the course. Ask a question, share
          something you noticed in the studio, or just say hello.
        </p>
      </header>

      <PostForm />

      <div className="mt-10 space-y-6">
        {posts.length === 0 && (
          <p className="text-sm text-brand-muted text-center py-12">
            No posts yet. Be the first to start a conversation.
          </p>
        )}
        {posts.map((post) => {
          const canDelete =
            !post.deletedAt && (isAdmin || post.authorId === currentUserId);
          return (
            <article
              key={post.id}
              className="bg-white border border-brand-border rounded-2xl p-5"
            >
              <PostHeader
                name={post.author.name}
                role={post.author.role}
                createdAt={post.createdAt}
              />
              <PostBody body={post.body} deletedAt={post.deletedAt} />
              <div className="mt-3 flex items-center gap-4">
                <ReplyForm parentId={post.id} />
                {canDelete && <DeleteButton postId={post.id} />}
              </div>

              {post.replies.length > 0 && (
                <ul className="mt-5 pl-4 border-l-2 border-brand-border space-y-4">
                  {post.replies.map((reply) => {
                    const canDeleteReply =
                      !reply.deletedAt &&
                      (isAdmin || reply.authorId === currentUserId);
                    return (
                      <li key={reply.id}>
                        <PostHeader
                          name={reply.author.name}
                          role={reply.author.role}
                          createdAt={reply.createdAt}
                        />
                        <PostBody
                          body={reply.body}
                          deletedAt={reply.deletedAt}
                        />
                        {canDeleteReply && (
                          <div className="mt-2">
                            <DeleteButton postId={reply.id} />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function PostHeader({
  name,
  role,
  createdAt,
}: {
  name: string;
  role: string;
  createdAt: Date;
}) {
  return (
    <div className="flex items-baseline justify-between flex-wrap gap-x-3 gap-y-1">
      <div className="flex items-baseline gap-2">
        <span className="font-medium text-brand-primary">{name}</span>
        {role === "ADMIN" && (
          <span className="text-[10px] tracking-[0.2em] uppercase bg-brand-sage/15 text-brand-sage px-2 py-0.5 rounded-full">
            balance team
          </span>
        )}
      </div>
      <time className="text-xs text-brand-muted">
        {createdAt.toLocaleString("en-IE", DATE_FMT)}
      </time>
    </div>
  );
}

function PostBody({
  body,
  deletedAt,
}: {
  body: string;
  deletedAt: Date | null;
}) {
  if (deletedAt) {
    return (
      <p className="mt-2 text-sm text-brand-muted italic">
        [deleted]
      </p>
    );
  }
  return (
    <p className="mt-2 text-sm text-brand-primary whitespace-pre-wrap leading-relaxed">
      {body}
    </p>
  );
}
