import { useState } from 'react'

import { Box, Button, makeStyles, Theme } from '@material-ui/core'

import { CloseButton } from '@app/views/components/Button/CloseButton'
import PageLayout from 'components/GlobalPageLayout'

import { UploadingBanner } from './components/UploadingBanner'
import { UploadSteps } from './components/UploadSteps'
import { Context } from './context'
import { useAutoMapFields } from './hooks/use-auto-map'
import { useOwner } from './hooks/use-owner'
import { useParseCsv } from './hooks/use-parse-csv'
import { useUploadContacts } from './hooks/use-upload-contacts'
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
  const [file, setFile] = useState<Nullable<File>>(null)
  const [owner, setOwner] = useOwner()
  const parsedCsv = useParseCsv(file)
  const [mappedFields, setMappedFields] = useAutoMapFields(parsedCsv)
  const [uploadContacts, isUploadingContacts] = useUploadContacts(
    owner,
    file,
    mappedFields
  )

  return (
    <PageLayout className={classes.layout}>
      <PageLayout.Header title="Import a CSV file">
        <CloseButton backUrl="/dashboard/contacts" />
      </PageLayout.Header>

      <PageLayout.Main>
        <Context.Provider
          value={{
            file,
            owner,
            mappedFields,
            csv: parsedCsv
          }}
        >
          <Box display="flex" flexDirection="column" height="100%">
            <UploadSteps isUploadingContacts={isUploadingContacts} />

            <Box flexGrow={1}>
              {isUploadingContacts ? (
                <UploadingBanner />
              ) : (
                <>
                  {!file && (
                    <SelectFile
                      onSelectFile={setFile}
                      onChangeOwner={setOwner}
                    />
                  )}
                  {file && <MapFields setMappedFields={setMappedFields} />}
                </>
              )}
            </Box>

            {file && !isUploadingContacts && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                className={classes.footer}
              >
                <Button onClick={() => setFile(null)}>Change File</Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={uploadContacts}
                >
                  Upload Contacts
                </Button>
              </Box>
            )}
          </Box>
        </Context.Provider>
      </PageLayout.Main>
    </PageLayout>
  )
}
