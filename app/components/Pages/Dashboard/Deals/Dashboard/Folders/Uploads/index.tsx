import { useState, useMemo } from 'react'

import { Grid, Box, Typography, Button } from '@material-ui/core'
import AutoSizer from 'react-virtualized-auto-sizer'

import VirtualList from 'components/VirtualList'

import UploadManager from '../../../UploadManager'
import { useStyles } from '../Checklist/styles'

import { File } from './File'
import UploadPlaceholder from './UploadPlaceholder'

interface Props {
  deal: IDeal
}

export function UploadFolder({ deal }: Props) {
  const classes = useStyles()
  const [isFolderExpanded, setIsFolderExpanded] = useState<boolean>(true)
  const files = useMemo(
    () => (deal.files || []).sort((a, b) => b.created_at - a.created_at),
    [deal.files]
  )

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
          container
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

      {isFolderExpanded && files.length > 0 && (
        <div
          style={{
            width: '100%',
            height: files.length < 10 ? `${files.length * 64}px` : '70vh'
          }}
        >
          <AutoSizer>
            {({ width, height }) => (
              <VirtualList
                width={width}
                height={height}
                itemCount={files.length}
                itemData={
                  {
                    deal,
                    files
                  } as React.ComponentProps<typeof File>['data']
                }
                threshold={2}
                itemSize={() => 60}
                overscanCount={3}
              >
                {File}
              </VirtualList>
            )}
          </AutoSizer>
        </div>
      )}
    </Grid>
  )
}
