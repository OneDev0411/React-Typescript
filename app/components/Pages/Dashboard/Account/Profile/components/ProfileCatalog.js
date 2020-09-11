import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Button, IconButton, Box } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import editUser from 'actions/user/edit'
import { uploadUserAvatarAction } from 'actions/user/upload-avatar'
import { confirmation } from 'actions/confirmation'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { ImageUploader } from 'components/ImageUploader'
import Tooltip from 'components/tooltip'
import { Avatar } from 'components/Avatar'

const Container = styled.div`
  @media (min-width: 50em) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const ProfileImageActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 1rem;

  @media (min-width: 50em) {
    margin-top: 0;
  }
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
      return 'Uploading'
    }

    if (this.props.user.profile_image_url) {
      return 'Update'
    }

    return 'Upload'
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <Avatar
            user={this.props.user}
            size="xlarge"
            data-test="profile-avatar-image"
          />

          <ProfileImageActions>
            {this.props.user.profile_image_url && (
              <Box marginRight={2}>
                <Tooltip caption="Delete Profile Picture">
                  <IconButton
                    disabled={this.props.isUploading}
                    onClick={this.onDelete}
                    data-test="profile-avatar-delete-button"
                  >
                    <SvgIcon path={mdiTrashCanOutline} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            <Button
              variant="outlined"
              disabled={this.props.isUploading}
              onClick={this.openModal}
              data-test="profile-avatar-upload-button"
            >
              {`${this.getImageUploadButtonText()} Profile Picture`}
            </Button>
            {this.state.isOpen && this.renderUploader()}
          </ProfileImageActions>
        </Container>
        <hr />
      </React.Fragment>
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
          await dispatch(uploadUserAvatarAction(file))
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
  connect(null, {
    confirmation
  })
)(ProfileCatalog)
