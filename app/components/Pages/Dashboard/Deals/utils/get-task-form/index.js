export function getTaskForm(deal, task) {
  const { submission } = task

  // get or create pdfFile object
  const file = submission
    ? submission.file
    : {
        name: task.title,
        url: `https://rechat-forms.s3-us-west-2.amazonaws.com/${task.form}.pdf`
      }

  file.type = 'pdf'

  // create download url
  const fileType = submission ? 'submission' : 'raw'

  file.downloadUrl = `/api/deals/pdf/download/${deal.id}/${task.id}/${fileType}`

  return file
}
