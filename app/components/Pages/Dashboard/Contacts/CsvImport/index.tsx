import { useState } from 'react'

import { Box, Button, makeStyles, Theme } from '@material-ui/core'

import { CloseButton } from '@app/views/components/Button/CloseButton'
import PageLayout from 'components/GlobalPageLayout'

import { Context } from './context'
import { useAttributes } from './hooks/use-attributes'
import { useParseCsv } from './hooks/use-parse-csv'
import { MapFields } from './steps/MapFields'
import { SelectFile } from './steps/SelectFile'

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: {
      height: '100vh',
      overflow: 'none'
    },
    footer: {
      borderTop: `1px solid ${theme.palette.action.disabled}`,
      textAlign: 'right',
      height: theme.spacing(8),
      '& button': {
        marginLeft: theme.spacing(1)
      }
    }
  }),
  {
    name: 'Contacts-ImportCsv'
  }
)

export default function CsvImport() {
  const classes = useStyles()
  const attributes = useAttributes()
  const [file, setFile] = useState<Nullable<File>>(null)
  const parsedCsv = useParseCsv(file)

  return (
    <PageLayout className={classes.layout}>
      <PageLayout.Header title="Import a CSV file">
        <CloseButton backUrl="/dashboard/contacts" />
      </PageLayout.Header>

      <PageLayout.Main>
        <Context.Provider
          value={{
            file,
            attributes,
            csv: parsedCsv
          }}
        >
          <Box display="flex" flexDirection="column" height="100%">
            <Box flexGrow={1}>
              {!file && <SelectFile onSelectFile={setFile} />}
              {file && <MapFields />}
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              className={classes.footer}
            >
              <Button variant="outlined">Cancel</Button>

              <Button variant="contained" color="primary">
                Next
              </Button>
            </Box>
          </Box>
        </Context.Provider>
      </PageLayout.Main>
    </PageLayout>
  )
}
