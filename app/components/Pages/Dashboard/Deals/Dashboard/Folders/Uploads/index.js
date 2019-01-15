import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import Flex from 'styled-flex-component'

import copy from 'utils/copy-text-to-clipboard'

import ActionButton from 'components/Button/ActionButton'

import IconEmail from 'components/SvgIcons/DealEmail/IconEmail'

import Tooltip from 'components/tooltip'

import UploadManager from '../../../UploadManager'
import Files from './Files'

import { EmailButton } from './styled'

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

  toggleFolderOpen = () =>
    this.setState(state => ({
      isFolderExpanded: !state.isFolderExpanded
    }))

  handleCopyEmail = () => {
    copy(this.props.deal.email)

    this.props.notify({
      message: 'Link Copied',
      status: 'success'
    })
  }

  render() {
    return (
      <FolderContainer>
        <Header>
          <Flex
            alignCenter
            style={{ cursor: 'pointer' }}
            onClick={this.toggleFolderOpen}
          >
            <ArrowIcon isOpen={this.state.isFolderExpanded} />
            <HeaderTitle>Uploaded Files</HeaderTitle>
          </Flex>

          <Flex alignCenter>
            <UploadManager deal={this.props.deal}>
              <ActionButton size="small" as="span">
                Upload Files
              </ActionButton>
            </UploadManager>

            <EmailButton
              appearance="outline"
              size="small"
              style={{ marginLeft: '0.5rem' }}
              onClick={this.handleCopyEmail}
            >
              <Tooltip caption={this.props.deal.email}>
                <Flex alignCenter>
                  <IconEmail
                    style={{ height: '1rem', marginRight: '0.25rem' }}
                  />
                  Copy Email Address
                </Flex>
              </Tooltip>
            </EmailButton>
          </Flex>
        </Header>

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
