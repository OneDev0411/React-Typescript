import React from 'react'
import { Box, Typography, Link } from '@material-ui/core'

import { useStyles } from '../../styles'
import IconUpload from 'components/SvgIcons/Upload/IconUpload'
import { useIconStyles } from 'views/../styles/use-icon-styles'

export default function UploadPlaceholderItem() {
  const classes = useStyles()
  const iconClasses = useIconStyles()

  return (
    <Box className={classes.placeholderCard}>
      <Box width={1}>
        <Box component="p">
          <IconUpload fillColor="#ccc" className={iconClasses.large} />
        </Box>

        <Typography variant="body1">
          Drag &amp; Drop or <Link href="#">Upload</Link>
        </Typography>
      </Box>
    </Box>
  )
}
