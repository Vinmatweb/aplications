export function isStaticHosting(): boolean {
  return typeof window !== "undefined" &&
    (window as Window & { PAPERWORK_STATIC?: boolean }).PAPERWORK_STATIC === true;
}

export function publicAssetUrl(path: string): string {
  return isStaticHosting()
    ? new URL(path.replace(/^\/+/, ""), document.baseURI).href
    : path;
}
