import React from 'react'
import PropTypes from 'prop-types'

import {
  Container,
  Status,
  Image,
  Initials,
  Loading,
  Input,
  Trigger,
  TriggerText
} from './styled'

AvatarUploader.propTypes = {
  avatar: PropTypes.shape({
    size: PropTypes.number,
    src: PropTypes.string,
    display_name: PropTypes.string
  }),
  status: PropTypes.string,
  isUploading: PropTypes.bool.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleOnDelete: PropTypes.func
}

AvatarUploader.defaultProps = {
  avatar: {
    size: 104,
    src: '',
    display_name: ''
  },
  status: ''
}

export function AvatarUploader({
  avatar,
  status,
  isUploading,
  handleOnChange,
  handleOnDelete
}) {
  return (
    <Container size={avatar.size}>
      {avatar.src ? (
        <Image src={avatar.src} alt="avatar" />
      ) : (
        <Initials>NH</Initials>
      )}
      {status && <Status status={status} />}
      <Trigger htmlFor="avatarImage" hasImage={avatar.src}>
        <TriggerText>{avatar.src ? 'Change' : 'Upload'}</TriggerText>
      </Trigger>
      {isUploading && <Loading />}
      {!isUploading && (
        <Input
          type="file"
          id="avatarImage"
          onChange={handleOnChange}
          accept="image/jpeg, image/png"
          className="c-avatar-__input"
        />
      )}
    </Container>
  )
}
