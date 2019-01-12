import React, { Fragment, Component } from 'react'
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
    status: ''
  }

  state = {
    isOpen: false
  }

  setAvatar = async data => {
    await this.props.handleOnChange(data)
    this.closeModal()
  }

  openModal = () => {
    this.setState({
      isOpen: true
    })
  }

  closeModal = () => {
    this.setState({
      isOpen: false
    })
  }

  renderUploading() {
    return <Loading>Uploading</Loading>
  }

  renderUploader() {
    return (
      <ImageUploader
        radius="50%"
        // file={this.props.avatar.src} // CORS PROBLEM FOR NOW!
        saveHandler={this.setAvatar}
        closeHandler={this.closeModal}
        width={300}
        height={300}
      />
    )
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
        <Status isOnline={isOnline} />
        <Trigger htmlFor="avatarImage" hasImage={avatar.src}>
          <TriggerText>{avatar.src ? 'Change' : 'Upload'}</TriggerText>
        </Trigger>
        {isUploading && this.renderUploading()}
        {!isUploading && (
          <Fragment>
            <button
              id="avatarImage"
              className="c-avatar-uploader__input"
              type="button"
              onClick={this.openModal}
            />
            {this.state.isOpen && this.renderUploader()}
          </Fragment>
        )}
      </Container>
    )
  }
}
