type SignatureType = 'Form' | 'Envelope' | 'File'

interface Params {
  task: IDealTask
  file?: IFile
  envelope?: IDealEnvelope
  type: SignatureType
}

export function getEsignAttachments({ task, file, envelope, type }: Params) {
  if (type === 'Form') {
    return getFormAttachments(task)
  }

  if (type === 'File') {
    return getFileAttachment(task, file!)
  }

  if (type === 'Envelope') {
    return getEnvelopeAttachment(task, envelope!)
  }

  return []
}

function getFormAttachments(task: IDealTask): IDealFile[] {
  const attachments: IDealFile[] = []

  if (task.submission) {
    attachments.push({
      ...task.submission.file,
      source: 'submission',
      url: task.pdf_url,
      task: task.id,
      checklist: task.checklist
    })
  } else if (task.form) {
    attachments.push({
      id: task.id,
      url: task.pdf_url,
      name: task.title,
      path: '',
      preview_url: '',
      public: false,
      updated_at: new Date(task.updated_at).getTime(),
      created_at: new Date(task.created_at).getTime(),
      created_by: '',
      deleted_at: null,
      mime: 'application/pdf',
      type: 'file',
      source: 'submission',
      task: task.id,
      checklist: task.checklist
    })
  }

  if (Array.isArray(task.room.attachments)) {
    task.room.attachments
      .filter(file => file.mime === 'application/pdf')
      .forEach(file => {
        attachments.push({
          ...file,
          source: 'attachment',
          task: task.id,
          checklist: task.checklist
        })
      })
  }

  return attachments
}

function getFileAttachment(task: IDealTask, file: IFile): IDealFile[] {
  if (file && file.mime === 'application/pdf') {
    return [
      {
        ...file,
        source: 'attachment',
        task: task.id,
        checklist: task.checklist
      }
    ]
  }

  return []
}

function getEnvelopeAttachment(
  task: IDealTask,
  envelope: IDealEnvelope
): IDealFile[] {
  return (envelope.documents || []).map(document => ({
    ...document.pdf,
    name: `${envelope.title}: ${document.pdf.name}`,
    source: 'attachment',
    task: task.id,
    checklist: task.checklist
  }))
}
