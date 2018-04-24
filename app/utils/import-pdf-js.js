export default async function importPdfJs() {
  /* eslint-disable max-len */
  const PDFJS = await import('pdfjs-dist' /* webpackChunkName: "pdfjs" */)

  const workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.entry.js'

  PDFJS.GlobalWorkerOptions.workerSrc = workerSrc

  return PDFJS
}
