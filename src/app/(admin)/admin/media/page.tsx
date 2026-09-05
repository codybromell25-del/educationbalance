import { ensureMediaBucket, listMedia, type MediaItem } from "@/lib/storage";
import MediaUploader from "@/components/admin/MediaUploader";
import MediaCard from "@/components/admin/MediaCard";

/**
 * Media library — self-serve image hosting for unit content.
 *
 * Images land in a PUBLIC bucket and get a permanent URL, so an author
 * can paste `<img src="…">` into a Text or Embed part and it keeps
 * working indefinitely (unlike the private course-files bucket, whose
 * signed links expire after an hour).
 */
export default async function AdminMediaPage() {
  let items: MediaItem[] = [];
  let configError: string | null = null;
  try {
    await ensureMediaBucket();
    items = await listMedia();
  } catch (e) {
    // Most likely SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing. Show
    // the message instead of a blank crash so it's obvious what to fix.
    configError = e instanceof Error ? e.message : "Media storage unavailable";
  }

  return (
    <div className="p-5 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          Media
        </h1>
        <p className="text-brand-muted mt-2 max-w-2xl">
          Upload images here, copy the link, and paste it into unit content as{" "}
          <code className="text-xs bg-brand-surface px-1.5 py-0.5 rounded">
            &lt;img src=&quot;…&quot;&gt;
          </code>
          . Links are permanent — they never expire and don&apos;t need to be
          re-copied.
        </p>
      </div>

      {configError ? (
        <div className="rounded-xl border border-brand-accent/40 bg-brand-accent/10 p-5 text-sm text-brand-primary">
          <p className="font-medium mb-1">Media storage isn&apos;t configured yet.</p>
          <p className="text-brand-muted">{configError}</p>
        </div>
      ) : (
        <>
          <MediaUploader />

          <div className="mt-10">
            <h2 className="text-sm tracking-wider uppercase text-brand-sage mb-4">
              Library ({items.length})
            </h2>
            {items.length === 0 ? (
              <div className="rounded-xl border border-brand-border bg-white py-12 text-center text-sm text-brand-muted">
                No images yet. Drop some in above.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((m) => (
                  <MediaCard
                    key={m.path}
                    path={m.path}
                    name={m.name}
                    size={m.size}
                    createdAt={m.createdAt}
                    publicUrl={m.publicUrl}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 rounded-xl border border-brand-border bg-white p-5 text-sm text-brand-muted space-y-2 max-w-2xl">
            <p className="text-brand-primary font-medium">Tips</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Content never displays wider than about 700px — images around
                1400–2000px wide and under 500 KB look sharp and load fast.
              </li>
              <li>
                Always add{" "}
                <code className="text-xs bg-brand-surface px-1 py-0.5 rounded">
                  style=&quot;max-width:100%&quot;
                </code>{" "}
                (or a class that does) so images fit on phones.
              </li>
              <li>
                Deleting an image here breaks it anywhere it&apos;s still used —
                there&apos;s no automatic check, so remove it from the unit first.
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
