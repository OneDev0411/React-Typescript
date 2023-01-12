import { useState } from 'react'

import {
  Box,
  IconButton,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import { useWindowSize } from 'react-use'

import { SvgIcon } from '../SvgIcons'

import { CategoriesSidebar } from './components/CategoriesSidebar'
import { DocumentsList } from './components/DocumentsList'
import { SearchField } from './components/SearchField'
import { DocumentRepositoryContext } from './context/document-repository'
import { useDocumentsRepository } from './queries/use-documents-repository'
import { RowActionsBuilder, SelectionType } from './types'

interface StyleProps {
  windowHeight: number
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: ({ windowHeight }: StyleProps) => ({
      position: 'relative',
      height: windowHeight - theme.spacing(10),
      overflow: 'hidden',
      width: '100%',
      backgroundColor: theme.palette.grey[50],
      paddingTop: theme.spacing(2)
    }),
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
  const { height: windowHeight } = useWindowSize()

  const classes = useStyles({ windowHeight })

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
        <Box display="flex" height="100%">
          <Box
            display="flex"
            flexDirection="column"
            minWidth="350px"
            maxWidth="350px"
            pr={0.5}
            className="u-scrollbar--thinner"
          >
            <Box
              display="flex"
              alignItems="center"
              className={classes.header}
              pl={3}
            >
              <Typography variant="h6">Documents</Typography>
            </Box>

            <Box width="100%" overflow="auto" mt={4} flexGrow={1}>
              <CategoriesSidebar
                isFetching={isFetching}
                onChangeActiveCategory={setActiveCategoryIndex}
              />
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            pr={0.5}
            className="u-scrollbar--thinner"
          >
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

            <Box mt={2} flexGrow={1} overflow="auto">
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
