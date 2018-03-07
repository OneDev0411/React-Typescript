import React from 'react'

const AvatarUploader = ({
  size = 96,
  avatar,
  uploading,
  handleChange,
  handleDelete,
  hasDelete
}) => (
  <div
    className="c-avatar-uploader"
    style={{ width: `${size}px`, height: `${size}px` }}
  >
    {avatar ? (
      <img src={avatar} alt="avatar" className="c-avatar-uploader__img" />
    ) : (
      <div className="c-avatar-uploader__placeholder">
        <svg
          width="96"
          height="96"
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
    {uploading && (
      <div className="c-avatar-uploader__loading">Uploading ...</div>
    )}
    {!uploading && (
      <input
        type="file"
        id="avatarImage"
        onChange={handleChange}
        accept="image/jpeg, image/png"
        className="c-avatar-uploader__input"
      />
    )}
    {hasDelete &&
      avatar &&
      !uploading && (
        <button
          onClick={handleDelete}
          className="c-avatar-uploader__remove-btn"
        >
          Delete Avatar
        </button>
      )}
  </div>
)

export default AvatarUploader
