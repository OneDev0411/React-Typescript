import React from 'react'
import Flex from 'styled-flex-component'
import styled from 'styled-components'

import Link from 'views/components/ALink'

const FileIcon = styled.img`
  max-width: 20px;
  max-height: 50px;
`

const FileNameLink = Link.extend`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 1em;
`

function getDocumentIcon(file) {
  let src

  if (isPdfDocument(file.mime) || file.envelope) {
    src = '/static/images/deals/pdf-icon.svg'
  } else if (file.mime.includes('image/')) {
    src = file.preview_url
  }

  return <FileIcon src={src} alt="File Icon" />
}

function isPdfDocument(mime) {
  return mime === 'application/pdf'
}

const FilesListName = ({ file, getFileLink }) => (
  <Flex nowrap alignCenter>
    {getDocumentIcon(file)}
    <FileNameLink to={getFileLink(file)}>{file.name}</FileNameLink>
  </Flex>
)

export default FilesListName
