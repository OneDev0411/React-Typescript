/**
 * get accepted documents in file upload
 */
export function getAcceptedDocuments() {
  return [
    '.png',
    '.gif',
    '.jpg',
    '.jpeg',
    '.docx',
    '.doc',
    '.pdf',
    '.xls',
    '.xlsx',
    '.mov',
    '.txt',
    '.csv',
    '.heic',
    '.mp4',
    '.html',
    '.pages'
  ].join(',')
}

export default {
  getAcceptedDocuments
}
