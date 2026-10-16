/**
 * Cloudflare Pages Middleware — Host-Konsolidierung für fknwine.com
 *
 * Zweck: Der Produktions-Alias `fknwine.pages.dev` und die `www`-Variante
 * liefern die Seite aktuell als vollwertiges Duplikat mit HTTP 200 aus. Google
 * hat deshalb für die Startseite `fknwine.pages.dev` als kanonische Seite
 * gewählt (GSC: „Duplikat – Google hat eine andere Seite als der Nutzer als
 * kanonische Seite bestimmt“), obwohl das Canonical-Tag auf fknwine.com zeigt.
 *
 * Diese Middleware beantwortet beide Fremd-Hosts dauerhaft mit 301 auf die
 * kanonische Domain — inklusive Pfad und Query.
 *
 * WICHTIG: Vorschau-Deployments (`<branch>.fknwine.pages.dev`) werden
 * absichtlich NICHT umgeleitet, damit Live-Previews weiter funktionieren.
 * fknwine.com selbst wird nie angefasst (nur `context.next()`).
 */

const CANONICAL_ORIGIN = "https://fknwine.com";

// Nur diese Hosts werden umgeleitet — bewusst als Liste, nicht per Wildcard.
const REDIRECT_HOSTS = ["fknwine.pages.dev", "www.fknwine.com"];

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    if (REDIRECT_HOSTS.includes(url.hostname.toLowerCase())) {
      return Response.redirect(`${CANONICAL_ORIGIN}${url.pathname}${url.search}`, 301);
    }
  } catch (_err) {
    // Ein Fehler hier darf die Seite niemals lahmlegen: durchreichen.
  }
  return context.next();
}
