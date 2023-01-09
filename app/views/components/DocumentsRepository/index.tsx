import { useState } from 'react'

import {
  Box,
  IconButton,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import { SvgIcon } from '../SvgIcons'

import { CategoriesSidebar } from './components/CategoriesSidebar'
import { DocumentsList } from './components/DocumentsList'
import { SearchField } from './components/SearchField'
import { DocumentRepositoryContext } from './context/document-repository'
import { useDocumentsRepository } from './queries/use-documents-repository'
import { RowActionsBuilder, SelectionType } from './types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'relative',
      width: '100%',
      backgroundColor: theme.palette.grey[50],
      paddingTop: theme.spacing(2)
    },
    header: {
      height: theme.spacing(6)
    }
  }),
  {
    name: 'DocumentRepository'
  }
)

export interface Props {
  selectionType: SelectionType
  RowActionsBuilder?: RowActionsBuilder
  deal?: IDeal
  onClose?: () => void
}

export function DocumentsRepository({
  selectionType,
  deal,
  RowActionsBuilder,
  onClose
}: Props) {
  const classes = useStyles()
  const [activeCategoryIndex, setActiveCategoryIndex] =
    useState<Nullable<number>>(null)
  const [searchCriteria, setSearchCriteria] = useState('')

  const { forms, categoryNames, isFetching } = useDocumentsRepository(deal)

  return (
    <DocumentRepositoryContext.Provider
      value={{
        isFetching,
        searchCriteria,
        categoryNames,
        activeCategoryIndex,
        forms: isFetching ? {} : forms
      }}
    >
      <Box className={classes.root}>
        <Box display="flex">
          <Box minWidth="300px" maxWidth="300px">
            <Box
              display="flex"
              alignItems="center"
              className={classes.header}
              pl={3}
            >
              <Typography variant="h6">Documents</Typography>
            </Box>

            <Box width="100%" mt={2}>
              <CategoriesSidebar
                isFetching={isFetching}
                onChangeActiveCategory={setActiveCategoryIndex}
              />
            </Box>
          </Box>

          <Box flexGrow={1}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pr={2}
              className={classes.header}
            >
              <Box width="300px">
                <SearchField debounceTime={500} onChange={setSearchCriteria} />
              </Box>

              <Box>
                {onClose && (
                  <IconButton onClick={onClose}>
                    <SvgIcon path={mdiClose} />
                  </IconButton>
                )}
              </Box>
            </Box>

            <Box mt={2}>
              <DocumentsList
                selectionType={selectionType}
                RowActionsBuilder={RowActionsBuilder}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </DocumentRepositoryContext.Provider>
  )
}
