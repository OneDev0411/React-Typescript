import { useCallback, useMemo, useState } from 'react'

import {
  Box,
  CircularProgress,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'

import { DealFormsList } from '../../DealFormsList'
import { DocumentRepositorySelectionContext } from '../context/document-repository-selection'
import { useDocumentRepositoryContext } from '../context/use-document-repository-context'
import { useFolders } from '../hooks/use-folders'
import { RowActionsBuilder, SelectionType } from '../types'

import { BulkActions } from './bulk-actions/BulkActions'
import { DocumentFolder } from './DocumentFolder'
import { SearchEmptyState } from './SearchEmptyState'
import { DocumentsRepositoryZeroState } from './ZeroState'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      backgroundColor: '#fff',
      borderLeft: `1px solid ${theme.palette.grey['200']}`,
      borderTop: `1px solid ${theme.palette.grey['200']}`,
      height: '100%'
    }
  }),
  {
    name: 'DocumentRepositoryDocumentsList'
  }
)

interface Props {
  selectionType: SelectionType
  RowActionsBuilder?: RowActionsBuilder
}

export function DocumentsList({ selectionType, RowActionsBuilder }: Props) {
  const classes = useStyles()
  const [selectionState, setSelectionState] = useState<
    Record<string, Record<string, boolean>>
  >({})
  const [isBulkActionWorking, setIsBulkActionWorking] = useState(false)

  const [folders] = useFolders()
  const { searchCriteria, isFetching, activeCategoryIndex } =
    useDocumentRepositoryContext()

  const selectedForms: UUID[] = useMemo(
    () =>
      Object.values(selectionState).reduce<UUID[]>((result, ids) => {
        const values = Object.entries(ids)
          .filter(([_, state]) => !!state)
          .map(([id]) => id)

        return [...result, ...values]
      }, []),
    [selectionState]
  )

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

  const toggleFolderSelection = useCallback(
    (category: string, checked: boolean) => {
      if (checked) {
        const selectAll = folders
          .find(folder => folder.title === category)
          ?.list.reduce(
            (acc, item) => ({
              ...acc,
              [item.id]: true
            }),
            {}
          )

        setSelectionState(state => ({
          ...state,
          [category]: selectAll ?? {}
        }))
      } else {
        setSelectionState(state => ({
          ...state,
          [category]: {}
        }))
      }
    },
    [folders]
  )

  const handleReset = useCallback(() => setSelectionState({}), [])

  return (
    <DocumentRepositorySelectionContext.Provider
      value={{
        selectionState,
        selectedForms,
        isBulkActionWorking,
        setIsBulkActionWorking
      }}
    >
      <Box className={classes.root} p={3}>
        {!isFetching && !searchCriteria && activeCategoryIndex === null && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <DocumentsRepositoryZeroState />
          </Box>
        )}

        {searchCriteria.length > 0 && (
          <Box
            mb={2}
            display="flex"
            flexDirection="column"
            height={folders.length === 0 ? '100%' : 'unset'}
          >
            <Typography variant="button">
              Search results for “{searchCriteria}”
            </Typography>

            {folders.length === 0 && (
              <Box
                flexGrow={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <SearchEmptyState />
              </Box>
            )}
          </Box>
        )}

        {isFetching && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        )}

        {!isFetching && folders.length > 0 && (
          <Box pb={12}>
            {folders.map(({ title, list }) => (
              <DocumentFolder
                key={title}
                title={title}
                selectionType={selectionType}
                totalCount={list.length}
                selectionList={selectionState[title] ?? {}}
                onToggleFolderSelection={checked =>
                  toggleFolderSelection(title, checked)
                }
              >
                <DealFormsList
                  forms={list}
                  selectionType={selectionType}
                  RowActionsBuilder={RowActionsBuilder}
                  selectionList={selectionState[title] ?? {}}
                  onChangeSelection={(formId, checked) =>
                    updateSelectionState(title, formId, checked)
                  }
                  textHighlight={searchCriteria}
                />
              </DocumentFolder>
            ))}
          </Box>
        )}

        <Box width="100%">
          <BulkActions onReset={handleReset} />
        </Box>
      </Box>
    </DocumentRepositorySelectionContext.Provider>
  )
}
