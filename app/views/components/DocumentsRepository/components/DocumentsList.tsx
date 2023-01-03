import { Box, makeStyles, Theme, Typography } from '@material-ui/core'

import { DealFormsList } from '../../DealFormsList'
import { useDocumentRepositoryContext } from '../context/use-document-repository-context'
import { useFolders } from '../hooks/use-folders'

import { DocumentFolder } from './DocumentFolder'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      backgroundColor: '#fff',
      borderLeft: `1px solid ${theme.palette.grey['200']}`,
      borderTop: `1px solid ${theme.palette.grey['200']}`
    }
  }),
  {
    name: 'DocumentRepositoryDocumentsList'
  }
)

export function DocumentsList() {
  const classes = useStyles()

  const [folders] = useFolders()
  const { searchCriteria } = useDocumentRepositoryContext()

  return (
    <Box className={classes.root} height="700px" overflow="scroll" p={3}>
      {searchCriteria.length > 0 && (
        <Box mb={2}>
          <Typography variant="button">
            Search results for “{searchCriteria}”
          </Typography>
        </Box>
      )}

      <>
        {folders.map(({ title, list }, index) => (
          <DocumentFolder key={index} title={title} totalCount={list.length}>
            <DealFormsList forms={list} selectionType="multiple" />
          </DocumentFolder>
        ))}
      </>
    </Box>
  )
}
