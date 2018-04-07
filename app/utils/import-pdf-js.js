export default async function importPdfJs() {
  /* eslint-disable max-len */
  const PDFJS = await import('pdfjs-dist' /* webpackChunkName: "pdfjs" */)

  const workerSrc = `//unpkg.com/pdfjs-dist@${
    PDFJS.version
  }/build/pdf.worker.min.js`

  PDFJS.GlobalWorkerOptions.workerSrc = workerSrc

  console.log('[ i ] pdfjs worker: ', workerSrc)

  return PDFJS
}
