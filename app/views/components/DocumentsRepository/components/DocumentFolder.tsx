import { Box, makeStyles, Theme, Typography } from '@material-ui/core'
import pluralize from 'pluralize'

import { DocumentFolderSelection } from './DocumenFolderSelection'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      border: `1px solid ${theme.palette.grey[200]}`
    },
    header: {
      backgroundColor: theme.palette.grey[50],
      padding: theme.spacing(1.5, 2),
      borderBottom: `1px solid ${theme.palette.grey[200]}`
    }
  }),
  {
    name: 'DocumentRepositoryDocumentFolder'
  }
)

interface Props {
  title: string
  totalCount: number
  selectionList: Record<string, boolean>
  onToggleFolderSelection: (checked: boolean) => void
  children: React.ReactNode
}

export function DocumentFolder({
  title,
  totalCount,
  selectionList,
  children,
  onToggleFolderSelection
}: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.root} mb={2}>
      <Box display="flex" alignItems="center" className={classes.header}>
        <Box mr={1}>
          <DocumentFolderSelection
            totalCount={totalCount}
            selectionList={selectionList}
            onChange={onToggleFolderSelection}
          />
        </Box>
        <Typography variant="subtitle1">{title}</Typography>
        <Box ml={1}>
          <Typography variant="body2">
            ({pluralize('Form', totalCount, true)})
          </Typography>
        </Box>
      </Box>

      <Box>{children}</Box>
    </Box>
  )
}
