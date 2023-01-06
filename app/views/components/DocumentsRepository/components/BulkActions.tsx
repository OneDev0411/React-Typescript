import { useMemo } from 'react'

import { Box, makeStyles, Slide, Theme, Typography } from '@material-ui/core'
import { mdiClose, mdiDownload, mdiEmail } from '@mdi/js'
import cn from 'classnames'

import { GridActionButton } from '../../Grid/Table/features/Actions/Button'
import { useGridActionButtonStyles } from '../../Grid/Table/features/Actions/use-grid-action-button-styles'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'absolute',
      bottom: theme.spacing(3),
      left: theme.spacing(3),
      right: theme.spacing(3)
    },
    selectionCount: {
      color: theme.palette.common.white
    }
  }),
  {
    name: 'DocumentRepositoryBulkActions'
  }
)

interface Props {
  selectionState: Record<string, Record<string, boolean>>
  onReset: () => void
}

export function BulkActions({ selectionState, onReset }: Props) {
  const classes = useStyles()
  const gridActionButtonClasses = useGridActionButtonStyles()

  const selectedForms = useMemo(
    () =>
      Object.values(selectionState).reduce((list, ids) => {
        const values = Object.entries(ids)
          .filter(([_, state]) => !!state)
          .map(([id]) => id)

        return [...list, ...values]
      }, []),
    [selectionState]
  )

  if (selectedForms.length === 0) {
    return null
  }

  return (
    <Slide in direction="up">
      <Box className={cn(gridActionButtonClasses.root, classes.root)}>
        <GridActionButton label="Cancel" icon={mdiClose} onClick={onReset} />

        <GridActionButton
          label="Selected"
          textIcon={
            <Typography
              variant="h6"
              color="textSecondary"
              className={classes.selectionCount}
            >
              {selectedForms.length}
            </Typography>
          }
          onClick={() => {}}
        />

        <GridActionButton
          label="Download"
          icon={mdiDownload}
          onClick={() => {}}
        />

        <GridActionButton label="Email" icon={mdiEmail} onClick={() => {}} />
      </Box>
    </Slide>
  )
}
