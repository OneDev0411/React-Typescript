import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import Flex from 'styled-flex-component'

import copy from 'utils/copy-text-to-clipboard'

import ActionButton from 'components/Button/ActionButton'

import UploadPlaceholder from './UploadPlaceholder'
import UploadManager from '../../../UploadManager'

import Files from './Files'

import {
  FolderContainer,
  Header,
  HeaderTitle,
  ItemsContainer,
  ArrowIcon
} from '../styled'

class Uploads extends React.Component {
  state = {
    isFolderExpanded: true
  }

  toggleFolderOpen = () => {
    if (this.hasStashFiles() === false) {
      return false
    }

    this.setState(state => ({
      isFolderExpanded: !state.isFolderExpanded
    }))
  }

  handleCopyEmail = () => {
    copy(this.props.deal.email)

    this.props.notify({
      message: 'Link Copied',
      status: 'success'
    })
  }

  hasStashFiles = () =>
    Array.isArray(this.props.deal.files) && this.props.deal.files.length > 0

  render() {
    return (
      <FolderContainer>
        <Header>
          <Flex
            alignCenter
            style={{ cursor: 'pointer' }}
            onClick={this.toggleFolderOpen}
          >
            <ArrowIcon
              isOpen={this.state.isFolderExpanded}
              display={this.hasStashFiles()}
            />
            <HeaderTitle>Unorganized Files</HeaderTitle>
          </Flex>

          <Flex>
            <UploadManager deal={this.props.deal}>
              <ActionButton size="small" as="span">
                Upload
              </ActionButton>
            </UploadManager>
          </Flex>
        </Header>

        <UploadPlaceholder deal={this.props.deal} />

        <ItemsContainer isOpen={this.state.isFolderExpanded}>
          <Files deal={this.props.deal} />
        </ItemsContainer>
      </FolderContainer>
    )
  }
}

export default connect(
  null,
  { notify }
)(Uploads)
