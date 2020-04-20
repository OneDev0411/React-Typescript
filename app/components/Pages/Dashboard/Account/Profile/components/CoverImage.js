import React, { useRef } from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Button, IconButton, Box } from '@material-ui/core'

import editUser from 'actions/user/edit'
import uploadCoverImage from 'actions/user/upload-cover-image'

import FormCard from 'components/FormCard'
import Tooltip from 'components/tooltip'
import TrashIcon from 'components/SvgIcons/Trash/TrashIcon'

const MAX_SIZE = 256
const MIN_WIDTH = 240
const MIN_HEIGHT = 280
const SUBMIT_LABEL_TEXT = 'Choose Image'
const UNEXPECTED_ERROR = 'An unexpected error occurred. Please try again.'

const CoverImage = ({
  value,
  isDeleting,
  coverImage,
  submitError,
  uploadHandler,
  deleteHandler,
  submitLabelText
}) => {
  const coverImageInputRef = useRef(null)

  const isUploading = submitLabelText !== SUBMIT_LABEL_TEXT

  return (
    <FormCard title="Cover Image">
      <div className="c-cover-image">
        <div className="c-cover-image__container">
          <div className="c-cover-image__image-wrapper">
            {coverImage ? (
              <img
                src={coverImage}
                alt="rechat agent cover"
                className="c-cover-image__img"
              />
            ) : (
              <div className="c-cover-image__placeholder">
                <svg
                  width="240"
                  height="280"
                  fill="#ccc"
                  viewBox="0 0 24 24"
                  className="c-avatar-uploader__svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          <div className="c-cover-image__controllers">
            <input
              type="file"
              onChange={uploadHandler}
              className="c-cover-image__input"
              value={value}
              ref={coverImageInputRef}
            />
            <Box display="flex" alignItems="center">
              {((coverImage && !isUploading) ||
                (!coverImage && isDeleting)) && (
                <Box marginRight={2}>
                  <Tooltip
                    caption={isDeleting ? 'Deleting...' : 'Delete Cover'}
                  >
                    <IconButton
                      onClick={deleteHandler}
                      disabled={isDeleting || isUploading}
                      data-test="cover-image-form-delete-button"
                    >
                      <TrashIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              <Button
                variant="outlined"
                onClick={() => coverImageInputRef.current.click()}
                disabled={isDeleting || isUploading}
                data-test="cover-image-form-delete-button"
              >
                {submitLabelText}
              </Button>
            </Box>
          </div>
        </div>
        {submitError && (
          <div className="c-auth__submit-error-alert">{submitError}</div>
        )}
        <dl className="c-cover-image__note clearfix">
          <dt>Maximum Size:</dt>
          <dd>{MAX_SIZE} KB</dd>
          <dt>Minimum Dimension:</dt>
          <dd>
            {MIN_WIDTH} * {MIN_HEIGHT} pixels
          </dd>
        </dl>
      </div>
    </FormCard>
  )
}

export default compose(
  connect(
    ({ user, brand }) => ({ user, brand }),
    {
      editUser,
      uploadCoverImage
    }
  ),
  withState(
    'coverImage',
    'setCoverImage',
    ({ user }) => user.cover_image_url || ''
  ),
  withState('value', 'setValue', ''),
  withState('submitError', 'setSubmitError', ''),
  withState('isDeleting', 'setIsDeleting', false),
  withState('submitLabelText', 'setSubmitLabelText', SUBMIT_LABEL_TEXT),
  withHandlers({
    uploadHandler: ({
      setCoverImage,
      setSubmitError,
      uploadCoverImage,
      setSubmitLabelText
    }) => async event => {
      const reader = new FileReader()
      const file = event.target.files[0]

      setSubmitError('')

      reader.addEventListener('load', () => {
        const img = new Image()
        const _URL = window.URL || window.webkitURL

        img.addEventListener('load', async () => {
          const { width, height, src } = img
          const size = Math.round(file.size / 1024)

          try {
            if (width < MIN_WIDTH || height < MIN_HEIGHT) {
              throw new Error(
                'Selected image dimensions is small! Please select a bigger one.'
              )
            }

            if (size > MAX_SIZE) {
              throw new Error(
                'Selected image sizes is large! Please select a smaller one.'
              )
            }

            setCoverImage(src)

            setSubmitLabelText('Uploading...')

            const user = await uploadCoverImage(file)

            if (user instanceof Error) {
              throw user
            }

            setSubmitLabelText(SUBMIT_LABEL_TEXT)
          } catch ({ message }) {
            // console.log(message)
            setCoverImage(null)
            setSubmitLabelText(SUBMIT_LABEL_TEXT)
            setSubmitError(message || UNEXPECTED_ERROR)
          }
        })

        img.src = _URL.createObjectURL(file)
      })

      try {
        reader.readAsDataURL(file)
      } catch ({ message }) {
        setSubmitError(message)
      }
    },
    deleteHandler: ({
      setValue,
      editUser,
      setCoverImage,
      setIsDeleting,
      setSubmitError
    }) => async () => {
      setSubmitError('')
      setIsDeleting(true)

      try {
        await editUser({ cover_image_url: '' })
        setValue('')
        setCoverImage(null)
        setIsDeleting(false)
      } catch (error) {
        // console.log(error)
        setIsDeleting(false)
        setSubmitError(UNEXPECTED_ERROR)
      }
    }
  })
)(CoverImage)
