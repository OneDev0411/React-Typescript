import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ImageUploader } from 'components/ImageUploader'

import { getNameInitials } from '../../../utils/helpers'

import {
  Container,
  Status,
  Image,
  Initials,
  Loading,
  Trigger,
  TriggerText
} from './styled'

export class AvatarUploader extends Component {
  static propTypes = {
    avatar: PropTypes.shape({
      size: PropTypes.number,
      src: PropTypes.string,
      initials: PropTypes.string,
      display_name: PropTypes.string
    }),
    status: PropTypes.string,
    showStatus: PropTypes.bool,
    isUploading: PropTypes.bool.isRequired,
    handleOnChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    avatar: {
      initials: '',
      size: 104,
      src: '',
      display_name: ''
    },
    status: '',
    showStatus: false
  }

  setAvatar = async data => {
    await this.props.handleOnChange(data)
    this.closeModal()
  }

  render() {
    const { avatar, isOnline, isUploading } = this.props

    return (
      <Container size={avatar.size}>
        {avatar.src ? (
          <Image src={avatar.src} alt="avatar" />
        ) : (
          <Initials>
            {avatar.initials || getNameInitials(avatar.display_name)}
          </Initials>
        )}
        {this.props.showStatus && <Status isOnline={isOnline} />}
        <Trigger htmlFor="avatarImage" hasImage={avatar.src}>
          <TriggerText>{avatar.src ? 'Change' : 'Upload'}</TriggerText>
        </Trigger>
        {isUploading && <Loading>Saving</Loading>}
        {!isUploading && (
          <>
            <ImageUploader
              onSelectImage={this.setAvatar}
              editorOptions={{
                dimensions: [300, 300]
              }}
            >
              {({ openDialog }) => (
                // eslint-disable-next-line
                <button id="avatarImage" type="button" onClick={openDialog} />
              )}
            </ImageUploader>
          </>
        )}
      </Container>
    )
  }
}
