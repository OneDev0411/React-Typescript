import pdfjs from 'pdfjs-dist'

export default async function importPdfJs() {
  /* eslint-disable max-len */
  // const pdfjs = await import('pdfjs-dist' /* webpackChunkName: "pdfviewjs" */)

  pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/rechat-pdfjs-worker@1.0.0/pdf.worker.min.js'

  return pdfjs
}
