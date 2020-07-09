import React from 'react'
import { Box, Typography, Link } from '@material-ui/core'
import { mdiProgressUpload } from '@mdi/js'
import { useTheme } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { useStyles } from '../../styles'

interface Props {
  uploaderRef: React.RefObject<any>
}

export default function UploadPlaceholderItem({ uploaderRef }: Props) {
  const theme = useTheme()
  const classes = useStyles()

  const openBrowse = () => {
    uploaderRef.current.open()
  }

  return (
    <Box className={classes.placeholderCard}>
      <Box width={1}>
        <Box component="p">
          <SvgIcon
            path={mdiProgressUpload}
            color={theme.palette.grey.A100}
            size={muiIconSizes.xlarge}
          />
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
