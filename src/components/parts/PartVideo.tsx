/**
 * Resolves a Vimeo or YouTube URL into a player-embed URL. Returns null
 * for any URL we don't recognise.
 *
 * Supported forms:
 *   - https://vimeo.com/123456789
 *   - https://vimeo.com/video/123456789
 *   - https://player.vimeo.com/video/123456789
 *   - https://www.youtube.com/watch?v=ID
 *   - https://youtube.com/watch?v=ID&...
 *   - https://youtu.be/ID
 *   - https://www.youtube.com/embed/ID
 *   - https://www.youtube.com/shorts/ID
 */
export function resolveEmbedUrl(url: string): string | null {
  const trimmed = url.trim();

  // Vimeo (incl. player.vimeo.com)
  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return `https://player.vimeo.com/video/${vimeo[1]}`;
  }

  // YouTube — youtu.be short link
  const youtuBe = trimmed.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
  if (youtuBe) {
    return `https://www.youtube.com/embed/${youtuBe[1]}`;
  }

  // YouTube — /embed/ID
  const ytEmbed = trimmed.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  if (ytEmbed) {
    return `https://www.youtube.com/embed/${ytEmbed[1]}`;
  }

  // YouTube — /shorts/ID
  const ytShorts = trimmed.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/);
  if (ytShorts) {
    return `https://www.youtube.com/embed/${ytShorts[1]}`;
  }

  // YouTube — /watch?v=ID
  const ytWatch = trimmed.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (ytWatch && /youtube\.com/.test(trimmed)) {
    return `https://www.youtube.com/embed/${ytWatch[1]}`;
  }

  return null;
}

export default function PartVideo({ videoUrl }: { videoUrl: string | null }) {
  if (!videoUrl) {
    return (
      <div className="aspect-video rounded-xl bg-brand-surface border border-dashed border-brand-border flex items-center justify-center">
        <p className="text-sm text-brand-muted">Video coming soon</p>
      </div>
    );
  }

  const embed = resolveEmbedUrl(videoUrl);
  if (!embed) {
    return (
      <p className="text-sm text-brand-muted">
        Unsupported video URL. Use a Vimeo or YouTube link.
      </p>
    );
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-black">
      <iframe
        src={embed}
        className="w-full h-full"
        title="Video"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
