export function normalizeAttachment({ type, task, file }) {
  return type === 'form'
    ? normalizeSubmissionForm(task)
    : normalizeFile(task, file)
}

export function normalizeAttachments(attachments) {
  return attachments.map(normalizeAttachment)
}

function normalizeDate(date) {
  if (typeof date === 'number') {
    return new Date(date * 1000)
  }

  return new Date(date)
}

export function normalizeFile(task, file) {
  return {
    type: 'file',
    id: `file_${file.id}`,
    task_id: task ? task.id : null,
    checklist: task ? task.checklist : null,
    file_id: file.id,
    title: file.name,
    url: file.url,
    date: normalizeDate(file.created_at || file.date)
  }
}

export function normalizeSubmissionForm(task) {
  return {
    type: 'form',
    id: `task_${task.id}`,
    task_id: task.id,
    file_id: task.submission.file.id,
    checklist: task.checklist,
    title: `${task.title}.pdf`,
    url: task.pdf_url,
    date: normalizeDate(task.created_at)
  }
}
