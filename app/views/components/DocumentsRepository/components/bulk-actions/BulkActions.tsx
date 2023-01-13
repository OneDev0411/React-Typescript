import { Box, makeStyles, Slide, Theme, Typography } from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import cn from 'classnames'

import { GridActionButton } from '../../../Grid/Table/features/Actions/Button'
import { useGridActionButtonStyles } from '../../../Grid/Table/features/Actions/use-grid-action-button-styles'
import { useDocumentRepositorySelectionContext } from '../../context/use-document-repository-selection-context'

import { DownloadBulkAction } from './DownloadBulkAction'
import { EmailBulkAction } from './EmailBulkAction'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'absolute',
      bottom: theme.spacing(3),
      left: theme.spacing(3),
      right: theme.spacing(3),
      width: 'auto'
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
  onReset: () => void
}

export function BulkActions({ onReset }: Props) {
  const classes = useStyles()
  const gridActionButtonClasses = useGridActionButtonStyles()
  const { selectedForms, isBulkActionWorking } =
    useDocumentRepositorySelectionContext()

  if (selectedForms.length === 0) {
    return null
  }

  return (
    <>
      <Slide in direction="up">
        <Box className={cn(gridActionButtonClasses.root, classes.root)}>
          <GridActionButton
            disabled={isBulkActionWorking}
            label="Cancel"
            icon={mdiClose}
            onClick={onReset}
          />

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
          />

          <DownloadBulkAction />
          <EmailBulkAction />
        </Box>
      </Slide>
    </>
  )
}
