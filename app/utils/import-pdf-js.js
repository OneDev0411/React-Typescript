import * as PDFJS from 'pdfjs-dist'

export default async function importPdfJs() {
  /* eslint-disable max-len */
  // const pdfjs = await import('pdfjs-dist' /* webpackChunkName: "pdfviewjs" */)

  PDFJS.GlobalWorkerOptions.workerSrc =
    'https://pdfjs-dist.surge.sh/pdf.worker.min.98bbbce.js'

  return PDFJS
}
