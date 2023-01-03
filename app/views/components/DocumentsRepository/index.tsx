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
import { DocumentRepositoryContext } from './context'
import { useDocumentsRepository } from './queries/use-documents-repository'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
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

export function DocumentsRepository() {
  const classes = useStyles()
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const { forms, categoryNames, isFetching } = useDocumentsRepository()

  return (
    <DocumentRepositoryContext.Provider
      value={{
        forms: isFetching ? {} : forms,
        categoryNames,
        activeCategoryIndex
      }}
    >
      <Box display="flex" className={classes.root}>
        <Box minWidth="300px" maxWidth="300px">
          <Box
            display="flex"
            alignItems="center"
            className={classes.header}
            pl={3}
          >
            <Typography variant="h6">Documents</Typography>
          </Box>

          <Box mt={2}>
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
              <SearchField />
            </Box>

            <Box>
              <IconButton>
                <SvgIcon path={mdiClose} />
              </IconButton>
            </Box>
          </Box>

          <Box mt={2}>
            <DocumentsList />
          </Box>
        </Box>
      </Box>
    </DocumentRepositoryContext.Provider>
  )
}
