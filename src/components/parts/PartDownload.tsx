export default function PartDownload({
  fileUrl,
  title,
}: {
  fileUrl: string | null;
  title: string;
}) {
  if (!fileUrl) {
    return (
      <div className="rounded-xl border border-dashed border-brand-border bg-brand-surface p-8 text-center">
        <p className="text-sm text-brand-muted">Download coming soon</p>
      </div>
    );
  }

  return (
    <a
      href={fileUrl}
      download
      className="inline-flex items-center gap-3 px-6 py-3 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
      Download {title}
    </a>
  );
}
