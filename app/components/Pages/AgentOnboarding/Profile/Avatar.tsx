import React from 'react'

import { Box, Button, Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { Avatar } from 'components/Avatar'
import { ImageUploader } from 'components/ImageUploader'
import { readFileAsDataUrl } from 'utils/file-utils/read-file-as-data-url'

import { Avatar as AvatarType } from './types'

interface Props {
  onChange: (src: AvatarType) => void
  data: AvatarType
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: `${theme.shape.borderRadius}px`
  }
}))

export default function ProfileAvatar({ onChange, data }: Props) {
  const classes = useStyles()

  const handleOnChange = async (file: File) => {
    const dataUrl = await readFileAsDataUrl(file)

    onChange({ src: dataUrl, file })
  }

  return (
    <>
      <Box
        mb={6}
        p={1.5}
        display="flex"
        alignItems="center"
        className={classes.container}
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center">
          <Avatar url={data.src} size="xxlarge" />
          <Box ml={3} textAlign="left">
            <Typography variant="h6">Your profile image</Typography>
            {data.type && (
              <Typography variant="body2">
                {/* eslint-disable-next-line max-len */}
                {`To make it easier for you we’ve used your ${data.type} account's image.`}
              </Typography>
            )}
          </Box>
        </Box>

        <ImageUploader
          onSelectImage={handleOnChange}
          editorOptions={{
            dimensions: [300, 300]
          }}
        >
          {({ openDialog }) => (
            <Button onClick={openDialog} variant="outlined">
              Change
            </Button>
          )}
        </ImageUploader>
      </Box>
    </>
  )
}
