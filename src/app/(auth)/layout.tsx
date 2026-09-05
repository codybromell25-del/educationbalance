/**
 * Auth route group layout (login, forgot-password, reset-password).
 *
 * Exists only to apply the app typography (`.font-app` — Raleway body,
 * Libre Baskerville italic headings) to the pre-login pages. Uses
 * `display: contents` so it adds no box of its own and every page keeps
 * its existing full-height layout untouched; inherited properties like
 * font-family still flow through to the children.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="font-app contents">{children}</div>;
}
