export default async function importPdfJs() {
  const PDFJS = await import('pdfjs-dist')

  if (typeof window !== 'undefined' && 'Worker' in window) {
    PDFJS.GlobalWorkerOptions.workerSrc =
      'https://pdfjs-dist.surge.sh/pdf.worker.min.98bbbce.js'
  }

  return PDFJS
}
