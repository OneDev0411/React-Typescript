import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import editUser from 'actions/user/edit'
import uploadAvatar from 'actions/user/upload-avatar'
import { confirmation } from 'actions/confirmation'

import Button from 'components/Button/ActionButton'
import IconButton from 'components/Button/IconButton'
import DeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import { ImageUploader } from 'components/ImageUploader'
import Tooltip from 'components/tooltip'

import Avatar from './Avatar'

const ProfileImageActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 50%;
`

class ProfileCatalog extends Component {
  state = {
    isOpen: false
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

  onDelete = async () => {
    this.props.confirmation({
      show: true,
      confirmLabel: 'Delete',
      message: 'Delete Profile Picture',
      onConfirm: async () => this.props.handleOnDelete(),
      description: 'Are you sure you want to delete your profile picture?'
    })
  }

  onAvatarSet = async data => {
    await this.props.handleOnChange(data)
    this.closeModal()
  }

  renderUploader() {
    return (
      <ImageUploader
        radius="50%"
        // file={this.props.avatar.src} // CORS PROBLEM FOR NOW!
        saveHandler={this.onAvatarSet}
        closeHandler={this.closeModal}
        width={300}
        height={300}
      />
    )
  }

  getImageUploadButtonText() {
    if (this.props.isUploading) {
      return 'Uploading Profile Picture'
    }

    if (this.props.user.profile_image_url) {
      return 'Update Profile Picture'
    }

    return 'Upload Profile Picture'
  }

  render() {
    return (
      <div>
        <div className="c-profile-catalog">
          <Avatar user={this.props.user} />

          <ProfileImageActions>
            {this.props.user.profile_image_url && (
              <Tooltip caption="Delete Profile Picture">
                <IconButton
                  disabled={this.props.isUploading}
                  appearance="outline"
                  style={{
                    width: '3rem',
                    marginRight: '1rem',
                    padding: 0
                  }}
                  onClick={this.onDelete}
                >
                  <DeleteIcon
                    style={{
                      margin: 'auto'
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
            <Button
              disabled={this.props.isUploading}
              appearance="outline"
              onClick={this.openModal}
            >
              {this.getImageUploadButtonText()}
            </Button>
            {this.state.isOpen && this.renderUploader()}
          </ProfileImageActions>
        </div>
        <hr />
      </div>
    )
  }
}

export default compose(
  connect(),
  withState('isUploading', 'setUploading', false),
  withState(
    'avatar',
    'setAvatar',
    props => props.user.profile_image_url || null
  ),
  withHandlers({
    handleOnChange: ({ dispatch, setAvatar, setUploading }) => async data => {
      const file = data.target ? data.target.files[0] : data.files.file

      // Create a new FileReader instance
      // https://developer.mozilla.org/en/docs/Web/API/FileReader
      let reader = new FileReader()

      // Once a file is successfully readed:
      reader.addEventListener('load', async () => {
        try {
          setAvatar(reader.result)
          setUploading(true)
          await dispatch(uploadAvatar(file))
        } catch (error) {
          setAvatar(null)
          console.log(error)
        } finally {
          setUploading(false)
        }
      })

      reader.readAsDataURL(file)
    },
    handleOnDelete: ({ setAvatar, dispatch }) => async () => {
      try {
        await dispatch(editUser({ profile_image_url: '' }))
        setAvatar(null)
      } catch (error) {
        console.log(error)
      }
    }
  }),
  connect(
    null,
    {
      confirmation
    }
  )
)(ProfileCatalog)
