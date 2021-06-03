import { useState } from 'react'
import { Grid, Box, Typography, Button } from '@material-ui/core'

import UploadPlaceholder from './UploadPlaceholder'
import UploadManager from '../../../UploadManager'

import { Files } from './Files'

import { useStyles } from '../Checklist/styles'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

export function UploadFolder({ deal, isBackOffice }: Props) {
  const classes = useStyles()
  const [isFolderExpanded, setIsFolderExpanded] = useState<boolean>(true)
  const files = (deal.files || []).sort((a, b) => b.created_at - a.created_at)

  const hasStashFiles = (): boolean =>
    Array.isArray(deal.files) && deal.files.length > 0

  const toggleFolderOpen = () => {
    if (hasStashFiles() === false) {
      return false
    }

    setIsFolderExpanded(!isFolderExpanded)
  }

  return (
    <Grid container className={classes.container}>
      <Grid container className={classes.header}>
        <Grid
          item
          xs={10}
          spacing={1}
          className={classes.titleContainer}
          onClick={toggleFolderOpen}
        >
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <Typography variant="subtitle1">Unorganized Files</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={2}>
          <Box textAlign="right">
            {/*
          // @ts-ignore TODO: js component */}
            <UploadManager deal={deal} disableClick>
              {({ onClick }) => (
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={onClick}
                >
                  Upload
                </Button>
              )}
            </UploadManager>
          </Box>
        </Grid>
      </Grid>

      <UploadPlaceholder deal={deal} />

      {isFolderExpanded && (
        <Grid container>
          {files.map((file, index) => (
            <Files key={file.id} index={index} deal={deal} file={file} />
          ))}
        </Grid>
      )}
    </Grid>
  )
}
