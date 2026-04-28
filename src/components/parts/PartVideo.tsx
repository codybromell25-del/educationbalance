function vimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (!match) return null;
  return `https://player.vimeo.com/video/${match[1]}`;
}

export default function PartVideo({ videoUrl }: { videoUrl: string | null }) {
  if (!videoUrl) {
    return (
      <div className="aspect-video rounded-xl bg-brand-surface border border-dashed border-brand-border flex items-center justify-center">
        <p className="text-sm text-brand-muted">Video coming soon</p>
      </div>
    );
  }

  const embed = vimeoEmbedUrl(videoUrl);
  if (!embed) {
    return (
      <p className="text-sm text-brand-muted">
        Unsupported video URL.
      </p>
    );
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-black">
      <iframe
        src={embed}
        className="w-full h-full"
        title="Video"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
