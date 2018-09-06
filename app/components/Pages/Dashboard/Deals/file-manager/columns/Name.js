import React from 'react'
import ReactDOM from 'react-dom'
import Flex from 'styled-flex-component'
import styled from 'styled-components'

import Link from 'views/components/ALink'
import ToolTip from 'components/tooltip'

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

export default class FilesListName extends React.Component {
  state = { showTooltip: false }
  componentDidMount() {
    if (this.fileName) {
      const fileNameDomNode = ReactDOM.findDOMNode(this.fileName)

      if (fileNameDomNode.offsetWidth - fileNameDomNode.scrollWidth < 0) {
        console.log(fileNameDomNode.getBoundingClientRect())
        
        this.setState({ showTooltip: true })
      }
    }
  }

  render() {
    const { file, getFileLink } = this.props

    return (
      <Flex nowrap alignCenter>
        {getDocumentIcon(file)}
        <ToolTip caption={this.state.showTooltip ? file.name : ''}>
          <FileNameLink
            to={getFileLink(file)}
            ref={ref => (this.fileName = ref)}
          >
            {file.name}
          </FileNameLink>
        </ToolTip>
      </Flex>
    )
  }
}
