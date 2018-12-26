export function normalizeAttachment({ type, task, file }) {
  return type === 'form'
    ? normalizeSubmissionForm(task)
    : normalizeFile(task, file)
}

export function normalizeFile(task, file) {
  return {
    type: 'file',
    id: `file_${file.id}`,
    task_id: task.id,
    file_id: file.id,
    title: file.name,
    url: file.url,
    date: file.created_at
  }
}

export function normalizeSubmissionForm(task) {
  return {
    type: 'form',
    id: `task_${task.id}`,
    task_id: task.id,
    revision: task.submission.last_revision,
    title: `${task.title}.pdf`,
    url: task.submission.file.url,
    date: task.created_at
  }
}
