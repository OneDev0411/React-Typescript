import { getEnvelopeAttachments } from '../get-envelope-attachments'

export function getEnvelopeEmailAttachments(
  task: IDealTask,
  envelope: IDealEnvelope
): IDealEmailFile[] {
  return getEnvelopeAttachments(task, envelope).map(document => ({
    id: document.pdf.id,
    name: `${envelope.title}: ${document.pdf.name}`,
    url: document.pdf.url
  }))
}

export function getFileEmailAttachments(
  task: IDealTask,
  file: IFile
): IDealEmailFile[] {
  return [
    {
      id: file.id,
      name: file.name,
      url: file.url
    }
  ]
}

export function getFormEmailAttachments(task: IDealTask): IDealEmailFile[] {
  return [
    {
      id: null,
      name: `${task.title}.pdf`,
      url: task.pdf_url
    }
  ]
}
