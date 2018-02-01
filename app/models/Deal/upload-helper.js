/**
 * get accepted documents in file upload
 */
export function getAcceptedDocuments() {
  return ['image/*', 'application/*'].join(',')
}

export default {
  getAcceptedDocuments
}
