/**
 * get accepted documents in file upload
 */
export function getAcceptedDocuments() {
  return [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.pdf',
    '.csv',
    '.xls',
    '.xlsx'
  ].join(',')
}

export default {
  getAcceptedDocuments
}
