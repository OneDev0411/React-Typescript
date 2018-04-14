export default async function importPdfJs() {
  /* eslint-disable max-len */
  const PDFJS = await import('pdfjs-dist' /* webpackChunkName: "pdfjs" */)

  const workerSrc = '../../dist/pdfjsWorker.js'

  PDFJS.GlobalWorkerOptions.workerSrc = workerSrc

  return PDFJS
}
