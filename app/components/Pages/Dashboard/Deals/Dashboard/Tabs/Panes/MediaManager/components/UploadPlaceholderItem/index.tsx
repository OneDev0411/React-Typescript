import React from 'react'
import { Box, Typography, Link } from '@material-ui/core'

import IconUpload from 'components/SvgIcons/Upload/IconUpload'
import { useIconStyles } from 'views/../styles/use-icon-styles'

import { useStyles } from '../../styles'

interface Props {
  uploaderRef: React.RefObject<any>
}

export default function UploadPlaceholderItem({ uploaderRef }: Props) {
  const classes = useStyles()
  const iconClasses = useIconStyles()

  const openBrowse = () => {
    uploaderRef.current.open()
  }

  return (
    <Box className={classes.placeholderCard}>
      <Box width={1}>
        <Box component="p">
          <IconUpload fillColor="#ccc" className={iconClasses.large} />
        </Box>

        <Typography variant="body1">
          Drag &amp; Drop or{' '}
          <Link href="#" onClick={openBrowse}>
            Upload
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}
