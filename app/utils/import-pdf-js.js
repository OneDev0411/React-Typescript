export default async function importPdfJs() {
  console.log('Running PDF.JS')

  const PDFJS = await import('pdfjs-dist')
  const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry')

  PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker

  return PDFJS
}
