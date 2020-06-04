import React from 'react'
import { Typography, Box, Button, IconButton } from '@material-ui/core'

import BareModal from 'components/BareModal'

import { useIconStyles } from 'views/../styles/use-icon-styles'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

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
  const iconClasses = useIconStyles()

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
            <CloseIcon className={iconClasses.small} />
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
