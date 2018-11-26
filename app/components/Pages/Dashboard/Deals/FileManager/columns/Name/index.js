import React from 'react'
import ReactDOM from 'react-dom'

import Flex from 'styled-flex-component'
import moment from 'moment'

import ToolTip from 'components/tooltip'
import { FileNameLink, FileIcon, FileDate } from './styled'

export default class FilesListName extends React.Component {
  state = {
    showTooltip: false
  }

  componentDidMount() {
    if (!this.fileName) {
      return false
    }

    const fileNameDomNode = ReactDOM.findDOMNode(this.fileName)

    if (fileNameDomNode.offsetWidth - fileNameDomNode.scrollWidth < 0) {
      this.setState({ showTooltip: true })
    }
  }

  getDocumentIcon = file => {
    let src

    if (this.isPdfDocument(file.mime) || file.envelope) {
      src = '/static/images/deals/pdf-icon.svg'
    } else if (file.mime.includes('image/') || file.preview_url) {
      src = file.preview_url
    }

    return <FileIcon src={src} alt="File Icon" />
  }

  isPdfDocument = mime => mime === 'application/pdf'

  getDate = date => {
    if (!date) {
      return ''
    }

    return moment.unix(date).format('MMMM DD, YY [at] hh:mm A')
  }

  render() {
    const { file, getFileLink } = this.props

    return (
      <Flex nowrap alignCenter>
        {this.getDocumentIcon(file)}

        <ToolTip caption={this.state.showTooltip ? file.name : ''}>
          <FileNameLink
            to={getFileLink(file)}
            ref={ref => (this.fileName = ref)}
          >
            {file.name}

            <FileDate>{this.getDate(file.created_at)}</FileDate>
          </FileNameLink>
        </ToolTip>
      </Flex>
    )
  }
}
