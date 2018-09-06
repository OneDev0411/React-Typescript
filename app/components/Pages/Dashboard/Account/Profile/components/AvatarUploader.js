import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import editUser from '../../../../../../store_actions/user/edit'
import uploadAvatar from '../../../../../../store_actions/user/upload-avatar'
import Button from '../../../../../../views/components/Button/ActionButton'

const RemoveButton = Button.extend`
  position: absolute;
  left: 13.8rem;
  bottom: 0;
  display: block;
`

const AvatarUploader = ({ avatar, onChangeHandler, avatarRemoveHandler }) => (
  <div className="c-avatar-uploader">
    {avatar ? (
      <img src={avatar} alt="avatar" className="c-avatar-uploader__img" />
    ) : (
      <div className="c-avatar-uploader__placeholder">
        <svg
          width="160"
          height="160"
          fill="#fff"
          viewBox="0 0 24 24"
          className="c-avatar-uploader__svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    )}
    <label
      htmlFor="avatarImage"
      className={`c-avatar-uploader__label ${avatar ? 'has-avatar' : ''}`}
    >
      <span>{avatar ? 'Change' : 'Upload'} Avatar</span>
    </label>
    <input
      type="file"
      id="avatarImage"
      onChange={onChangeHandler}
      accept="image/jpeg, image/png"
      className="c-avatar-uploader__input"
    />
    {avatar && (
      <RemoveButton
        appearance="outline"
        onClick={avatarRemoveHandler}
        size="small"
      >
        Remove Avatar
      </RemoveButton>
    )}
  </div>
)

export default compose(
  connect(
    null,
    { uploadAvatar, editUser }
  ),
  withState(
    'avatar',
    'setAvatar',
    ({ user }) => user.profile_image_url || null
  ),
  withHandlers({
    onChangeHandler: ({ setAvatar, uploadAvatar }) => async event => {
      const file = event.target.files[0]

      // Create a new FileReader instance
      // https://developer.mozilla.org/en/docs/Web/API/FileReader
      let reader = new FileReader()

      // Once a file is successfully readed:
      reader.addEventListener('load', async () => {
        try {
          setAvatar(reader.result)
          await uploadAvatar(file)
        } catch (error) {
          setAvatar(null)
          // console.log(error)
        }
      })

      reader.readAsDataURL(file)
    },
    avatarRemoveHandler: ({ setAvatar, editUser }) => async () => {
      try {
        await editUser({ profile_image_url: '' })
        setAvatar(null)
      } catch (error) {
        // console.log(error)
      }
    }
  })
)(AvatarUploader)
