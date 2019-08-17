export function normalizeAttachment({ type, task, file }) {
  return type === 'form'
    ? normalizeSubmissionForm(task, file)
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
    file_id: file.id,
    checklist: task ? task.checklist : null,
    title: file.name,
    url: file.url,
    date: normalizeDate(file.created_at || file.date)
  }
}

export function normalizeSubmissionForm(task, file) {
  return {
    type: 'form',
    id: `task_${task.id}`,
    task_id: task.id,
    file_id: file ? file.id : task.submission.file.id,
    checklist: task.checklist,
    title: `${task.title}.pdf`,
    url: file ? file.url : task.pdf_url,
    date: normalizeDate(task.created_at)
  }
}
