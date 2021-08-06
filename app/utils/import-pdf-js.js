export default async function importPdfJs() {
  const PDFJS = await import('pdfjs-dist')
  // const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry')

  PDFJS.GlobalWorkerOptions.workerSrc =
    'https://pdfjs-dist.surge.sh/pdf.worker.min.98bbbce.js'

  return PDFJS
}
