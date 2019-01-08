import React from 'react'

import CloseButton from 'components/Button/IconButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import { PdfViewer } from '..'
import { Container, ViewerContainer, Header, HeaderTitle } from './styled'

export class PdfViewerModal extends React.Component {
  onClose = () => this.props.onClose()

  render() {
    if (!this.props.isOpen) {
      return false
    }

    return (
      <Container>
        <Header>
          <HeaderTitle>{this.props.title}</HeaderTitle>

          <CloseButton iconSize="large" onClick={this.onClose}>
            <CloseIcon />
          </CloseButton>
        </Header>

        <ViewerContainer>
          <PdfViewer url={this.props.url} />
        </ViewerContainer>
      </Container>
    )
  }
}
