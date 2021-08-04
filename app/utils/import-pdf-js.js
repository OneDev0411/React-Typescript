export default async function importPdfJs() {
  const PDFJS = await import('pdfjs-dist')
  const PdfjsWorker = (await import('pdfjs-dist/build/pdf.worker')).default

  if (typeof window !== 'undefined' && 'Worker' in window) {
    PDFJS.GlobalWorkerOptions.workerPort = new PdfjsWorker()
  }

  return PDFJS
}
