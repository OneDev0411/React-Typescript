import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Tabs,
  Tab,
  makeStyles
} from '@material-ui/core'

import { ImageSelectDialogProps, TabValue } from './types'
import GifLibrary from './Tabs/GifLibrary'
import PhotoLibrary from './Tabs/PhotoLibrary'

const useStyles = makeStyles(
  () => ({
    dialogPaper: {
      height: '100%'
    }
  }),
  {
    name: 'ImageSelectDialog'
  }
)

export default function ImageSelectDialog({
  onSelect,
  onClose,
  dialogProps
}: ImageSelectDialogProps) {
  const classes = useStyles()
  const [selectedTab, setSelectedTab] = useState<TabValue>('photo-library')

  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      scroll="paper"
      {...dialogProps}
      onClose={onClose}
      classes={{
        paper: classes.dialogPaper
      }}
    >
      <DialogTitle>
        <Grid container>
          <Grid container item>
            <Tabs
              value={selectedTab}
              indicatorColor="primary"
              variant="scrollable"
              textColor="inherit"
              onChange={(event: unknown, newValue: TabValue) =>
                setSelectedTab(newValue)
              }
            >
              <Tab value="photo-library" label="Photo Library" />
              <Tab value="gif-library" label="GIF Library" />
            </Tabs>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        {selectedTab === 'gif-library' && (
          <GifLibrary onSelect={onSelect} query="" />
        )}
        {selectedTab === 'photo-library' && (
          <PhotoLibrary onSelect={onSelect} query="" />
        )}
      </DialogContent>
    </Dialog>
  )
}
