export function cleanDomain(url: string) {
  const host = new URL(url).hostname;

  return host.replace(/^www\./, ''); // remove www.
}
