import { useState, useContext } from 'react'

import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Box,
  Tabs,
  Tab,
  makeStyles
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import { useDebounce } from 'use-debounce'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { EditorDialog } from 'components/ImageEditor'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { isGifImage } from './helpers'
import GifLibrary from './Tabs/GifLibrary'
import PhotoLibrary from './Tabs/PhotoLibrary'
import TeamLibrary from './Tabs/TeamLibrary'
import Upload from './Tabs/Upload'
import { ImageSelectDialogProps, TabValue } from './types'

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
    },
    dialogContent: {
      display: 'flex'
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
  const [selectedTab, setSelectedTab] = useState<TabValue>(
    onUpload ? 'upload-photo' : 'team-library'
  )
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedSearchQuery] = useDebounce(searchQuery, 400)
  const [imageFileToEdit, setImageFileToEdit] =
    useState<Nullable<File | string>>(null)

  const isSearchableTabActive = isSearchableTab(selectedTab)

  const handleCloseImageEditor = () => {
    confirmation.setConfirmationModal({
      message: 'Are you sure about canceling the edit?',
      onConfirm: () => {
        setImageFileToEdit(null)
      }
    })
  }

  const handleEdit = async (file: File | string) => {
    if (isGifImage(file)) {
      await handleUploadImage(file)

      return
    }

    setImageFileToEdit(file)
  }

  const handleUploadImage = async (file: File | string) => {
    if (!onUpload) {
      return
    }

    const fileUrl = typeof file === 'string' ? file : await onUpload(file)

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
      disableEnforceFocus
      maxWidth="md"
      scroll="paper"
      {...dialogProps}
      onClose={onClose}
      classes={{
        paper: classes.dialogPaper
      }}
    >
      <DialogTitle disableTypography>
        <Grid container direction="row" justifyContent="space-between">
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
              <Tab value="team-library" label="Your Gallery" />
              <Tab value="photo-library" label="Stock Photos" />
              <Tab value="gif-library" label="GIFs" />
            </Tabs>
          </Grid>
          <Grid item>
            {isSearchableTabActive && (
              <Box component="span" display="inline-flex" pr={1}>
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  color="primary"
                  onChange={event => setSearchQuery(event.target.value)}
                />
              </Box>
            )}
            <IconButton onClick={onClose}>
              <SvgIcon path={mdiClose} />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container>
          {selectedTab === 'upload-photo' && (
            <Upload onSelectFile={handleEdit} />
          )}
          {selectedTab === 'team-library' && (
            <TeamLibrary
              onEdit={handleEdit}
              onSelect={onSelect}
              query={debouncedSearchQuery}
              setQuery={setSearchQuery}
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
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
