export default async function importPdfJs() {
  /* eslint-disable max-len */
  const pdfjs = await import('pdfjs-dist' /* webpackChunkName: "pdfjs" */)

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`


  return pdfjs
}
