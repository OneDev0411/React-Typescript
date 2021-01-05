import React, { useState, useContext } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Tabs,
  Tab,
  makeStyles
} from '@material-ui/core'
import { useDebounce } from 'use-debounce'

import { EditorDialog } from 'components/ImageEditor'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { ImageSelectDialogProps, TabValue } from './types'
import Upload from './Tabs/Upload'
import TeamLibrary from './Tabs/TeamLibrary'
import PhotoLibrary from './Tabs/PhotoLibrary'
import GifLibrary from './Tabs/GifLibrary'

const SEARCHABLE_IMAGE_TABS: TabValue[] = [
  'team-library',
  'photo-library',
  'gif-library'
]

function isSearchableTab(value: TabValue): boolean {
  return SEARCHABLE_IMAGE_TABS.includes(value)
}

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
  onUpload,
  onClose,
  dialogProps
}: ImageSelectDialogProps) {
  const classes = useStyles()
  const confirmation = useContext(ConfirmationModalContext)
  const [selectedTab, setSelectedTab] = useState<TabValue>('upload-photo')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedSearchQuery] = useDebounce(searchQuery, 400)
  const [imageFileToEdit, setImageFileToEdit] = useState<
    Nullable<File | string>
  >(null)

  const isSerchableTabActive = isSearchableTab(selectedTab)

  const handleCloseImageEditor = () => {
    confirmation.setConfirmationModal({
      message: 'Are you sure about canceling the edit?',
      onConfirm: () => {
        setImageFileToEdit(null)
      }
    })
  }

  const handleEdit = (file: File | string) => {
    setImageFileToEdit(file)
  }

  const handleUploadImage = async (file: File) => {
    if (!onUpload) {
      return
    }

    const fileUrl = await onUpload(file)

    onSelect(fileUrl)
  }

  if (imageFileToEdit) {
    return (
      <EditorDialog
        file={imageFileToEdit}
        onClose={handleCloseImageEditor}
        onSave={handleUploadImage}
      />
    )
  }

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
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Tabs
              value={selectedTab}
              indicatorColor="primary"
              variant="scrollable"
              textColor="inherit"
              onChange={(event: unknown, newValue: TabValue) =>
                setSelectedTab(newValue)
              }
            >
              {onUpload && <Tab value="upload-photo" label="Upload" />}
              <Tab value="team-library" label="Team Library" />
              <Tab value="photo-library" label="Photo Library" />
              <Tab value="gif-library" label="GIF Library" />
            </Tabs>
          </Grid>
          {isSerchableTabActive && (
            <Grid item>
              <TextField
                label="Search"
                value={searchQuery}
                color="primary"
                onChange={event => setSearchQuery(event.target.value)}
              />
            </Grid>
          )}
        </Grid>
      </DialogTitle>
      <DialogContent>
        {selectedTab === 'upload-photo' && <Upload onSelectFile={handleEdit} />}
        {selectedTab === 'team-library' && (
          <TeamLibrary
            onEdit={handleEdit}
            onSelect={onSelect}
            query={debouncedSearchQuery}
          />
        )}
        {selectedTab === 'photo-library' && (
          <PhotoLibrary
            onEdit={handleEdit}
            onSelect={onSelect}
            query={debouncedSearchQuery}
          />
        )}
        {selectedTab === 'gif-library' && (
          <GifLibrary onSelect={onSelect} query={debouncedSearchQuery} />
        )}
      </DialogContent>
    </Dialog>
  )
}
