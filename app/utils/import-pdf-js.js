export default async function importPdfJs() {
  /* eslint-disable max-len */
  const pdfjs = await import('pdfjs-dist' /* webpackChunkName: "pdfviewjs" */)

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.min.js`

  return pdfjs
}
