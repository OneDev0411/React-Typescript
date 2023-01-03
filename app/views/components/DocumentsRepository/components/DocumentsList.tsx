import {
  Box,
  CircularProgress,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'

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

  const [folders, isSearching] = useFolders()
  const { searchCriteria, isFetching } = useDocumentRepositoryContext()

  return (
    <Box className={classes.root} height="700px" overflow="scroll" p={3}>
      {searchCriteria.length > 0 && (
        <Box mb={2}>
          <Typography variant="button">
            Search results for “{searchCriteria}”
          </Typography>
        </Box>
      )}
      {isFetching || (isSearching && folders.length === 0) ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {folders.map(({ title, list }, index) => (
            <DocumentFolder key={index} title={title} totalCount={list.length}>
              <DealFormsList
                forms={list}
                selectionType="multiple"
                textHighlight={searchCriteria}
              />
            </DocumentFolder>
          ))}
        </>
      )}
    </Box>
  )
}
