import React, { useState } from 'react'
import { Box, Button, Avatar, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { ImageUploader } from 'components/ImageUploader'

interface Props {
  onChange: (src: string) => void
  src?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: `${theme.shape.borderRadius}px`
    },
    large: {
      width: theme.spacing(9),
      height: theme.spacing(9)
    }
  })
)

export default function ProfileAvatar({ onChange, src = '' }) {
  const classes = useStyles()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOnChange = async data => {
    const file = data.target ? data.target.files[0] : data.files.file
    let reader = new FileReader()

    reader.addEventListener('load', () => {
      onChange(reader.result)
    })

    reader.readAsDataURL(file)
  }

  return (
    <>
      <ImageUploader
        width={300}
        height={300}
        radius="50%"
        isOpen={isModalOpen}
        saveHandler={data => {
          handleOnChange(data)
          setIsModalOpen(false)
        }}
        closeHandler={() => setIsModalOpen(false)}
      />
      <Box
        mb={6}
        p={1.5}
        display="flex"
        alignItems="center"
        className={classes.container}
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center">
          <Avatar className={classes.large} variant="circle" src={src} />
          <Box ml={3} textAlign="left">
            <Typography variant="h6">Your profile image</Typography>
            <Typography variant="body2">
              To make it easier for you we’ve used your (google) image.
            </Typography>
          </Box>
        </Box>
        <Button onClick={() => setIsModalOpen(true)} variant="outlined">
          Change
        </Button>
      </Box>
    </>
  )
}
