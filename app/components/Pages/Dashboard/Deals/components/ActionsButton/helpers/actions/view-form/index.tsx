export function viewForm({ task }: { task: IDealTask }) {
  window.open(task.pdf_url, '_blank')
}
