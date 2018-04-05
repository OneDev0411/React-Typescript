export default async function importPdfJs() {
  const workerVersion = process.env.PDFJS_VERSION

  const workerSrc = `//unpkg.com/pdfjs-dist@${workerVersion}/build/pdf.worker.min.js`

  /* eslint-disable max-len */
  const PDFJS = await import('pdfjs-dist' /* webpackChunkName: "pdfjs" */)

  PDFJS.GlobalWorkerOptions.workerSrc = workerSrc

  console.log('[ i ] pdfjs worker: ', workerSrc)

  return PDFJS
}
