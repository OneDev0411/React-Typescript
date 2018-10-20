import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import editUser from 'actions/user/edit'
import uploadAvatar from 'actions/user/upload-avatar'
import { getUserInitials } from 'models/user/helpers/get-user-initials'

import { AvatarUploader } from 'components/AvatarUploader'

const Avatar = props => (
  <AvatarUploader
    {...props}
    avatar={{
      src: props.avatar,
      initials: getUserInitials(props.user)
    }}
  />
)

export default compose(
  connect(),
  withState('isUploading', 'setUploading', false),
  withState(
    'avatar',
    'setAvatar',
    props => props.user.profile_image_url || null
  ),
  withHandlers({
    handleOnChange: ({ dispatch, setAvatar, setUploading }) => async event => {
      const file = event.target.files[0]

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
  })
)(Avatar)
