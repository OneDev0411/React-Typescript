function getPdfFile(task) {
  return {
    name: task.title,
    url: `https://rechat-forms.s3-us-west-2.amazonaws.com/${task.formstack_id}.pdf`
  }
}

export default function (deal, task) {
  const { submission } = task

  // get or create pdfFile object
  const file = submission ? submission.file : getPdfFile(task)
  file.type = 'pdf'

  // create download url
  const fileType = submission ? 'submission': 'raw'
  file.downloadUrl = `/api/deals/pdf/download/${deal.id}/${task.id}/${fileType}`

  return file
}
