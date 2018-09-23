export default async function importPdfJs() {
  /* eslint-disable max-len */
  const PDFJS = await import('pdfjs-dist/webpack' /* webpackChunkName: "pdfjs" */)

  return PDFJS
}
