import React, { Component } from 'react'

import { Button, IconButton, Box, Tooltip } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import styled from 'styled-components'

import { confirmation } from 'actions/confirmation'
import editUser from 'actions/user/edit'
import { uploadUserAvatarAction } from 'actions/user/upload-avatar'
import { Avatar } from 'components/Avatar'
import { ImageUploader } from 'components/ImageUploader'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { readFileAsDataUrl } from 'utils/file-utils/read-file-as-data-url'

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
  onDelete = async () => {
    this.props.confirmation({
      show: true,
      confirmLabel: 'Delete',
      message: 'Delete Profile Picture',
      onConfirm: async () => this.props.handleOnDelete(),
      description: 'Are you sure you want to delete your profile picture?'
    })
  }

  getImageUploadButtonText() {
    if (this.props.isUploading) {
      return 'Uploading...'
    }

    if (this.props.user.profile_image_url) {
      return 'Update Profile Picture'
    }

    return 'Upload Profile Picture'
  }

  render() {
    return (
      <>
        <Container>
          <Avatar
            user={this.props.user}
            size="xxlarge"
            data-test="profile-avatar-image"
          />

          <ProfileImageActions>
            {this.props.user.profile_image_url && (
              <Box marginRight={2}>
                <Tooltip title="Delete Profile Picture">
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
            <ImageUploader
              onSelectImage={this.props.handleOnChange}
              editorOptions={{
                dimensions: [300, 300]
              }}
            >
              {({ openDialog }) => (
                <Button
                  variant="outlined"
                  disabled={this.props.isUploading}
                  onClick={openDialog}
                  data-test="profile-avatar-upload-button"
                >
                  {`${this.getImageUploadButtonText()}`}
                </Button>
              )}
            </ImageUploader>
          </ProfileImageActions>
        </Container>
        <hr />
      </>
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
    handleOnChange:
      ({ dispatch, setAvatar, setUploading }) =>
      async file => {
        try {
          const dataUrl = await readFileAsDataUrl(file)

          setAvatar(dataUrl)

          setUploading(true)
          await dispatch(uploadUserAvatarAction(file))
        } catch (error) {
          setAvatar(null)
          console.log(error)
        } finally {
          setUploading(false)
        }
      },
    handleOnDelete:
      ({ setAvatar, dispatch }) =>
      async () => {
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
