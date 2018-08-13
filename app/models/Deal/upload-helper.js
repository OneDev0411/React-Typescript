/**
 * get accepted documents in file upload
 */
export function getAcceptedDocuments() {
  return [
    'image/*',
    'application/pdf',
    'application/*',
    '.csv',
    '.xls',
    '.xlsx'
  ].join(',')
}

export default {
  getAcceptedDocuments
}
