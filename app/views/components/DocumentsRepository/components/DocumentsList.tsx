import { useCallback, useState } from 'react'

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
  const [selectionState, setSelectionState] = useState({})

  const folders = useFolders()
  const { searchCriteria, isFetching } = useDocumentRepositoryContext()

  const updateSelectionState = useCallback(
    (category: string, formId: UUID, checked: boolean) => {
      setSelectionState(state => ({
        ...state,
        [category]: {
          ...state[category],
          [formId]: checked
        }
      }))
    },
    []
  )

  // const { updateSelectionState } = useDocumentRepositorySelectionContext()

  return (
    <Box className={classes.root} height="700px" overflow="scroll" p={3}>
      {searchCriteria.length > 0 && (
        <Box mb={2}>
          <Typography variant="button">
            Search results for “{searchCriteria}”
          </Typography>
        </Box>
      )}
      {isFetching ? (
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
            <DocumentFolder key={title} title={title} totalCount={list.length}>
              <div>
                <DealFormsList
                  forms={list}
                  selectionType="multiple"
                  selectionList={selectionState[title] ?? {}}
                  onChangeSelection={(formId, checked) =>
                    updateSelectionState(title, formId, checked)
                  }
                  textHighlight={searchCriteria}
                />
              </div>
            </DocumentFolder>
          ))}
        </>
      )}
    </Box>
  )
}
