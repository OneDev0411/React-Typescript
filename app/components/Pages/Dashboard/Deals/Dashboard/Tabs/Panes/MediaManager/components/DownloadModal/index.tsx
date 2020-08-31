import React from 'react'
import { Typography, Box, Button, IconButton } from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import BareModal from 'components/BareModal'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useStyles } from '../../styles'

export default function DownloadModal({
  isOpen,
  link,
  onClose
}: {
  isOpen: boolean
  link: string
  onClose: () => void
}) {
  const classes = useStyles()

  return (
    <BareModal
      isOpen={isOpen}
      style={{
        content: { top: '40%', height: 'auto', overflow: 'initial' }
      }}
    >
      <Box padding={6} className={classes.downloadModal}>
        <Box className={classes.modalCloseButton}>
          <IconButton onClick={onClose}>
            <SvgIcon path={mdiClose} />
          </IconButton>
        </Box>
        <Typography variant="h3" gutterBottom>
          Your download is ready!
        </Typography>
        <Button
          variant="outlined"
          className={classes.lowerCaseButton}
          href={link}
        >
          Click to download
        </Button>
      </Box>
    </BareModal>
  )
}
