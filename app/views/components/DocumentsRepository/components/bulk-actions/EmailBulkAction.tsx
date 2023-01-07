import { useState } from 'react'

import { CircularProgress } from '@material-ui/core'
import { mdiEmail } from '@mdi/js'

import useNotify from '@app/hooks/use-notify'

import { SingleEmailComposeDrawer } from '../../../EmailCompose'
import { GridActionButton } from '../../../Grid/Table/features/Actions/Button'
import { useDocumentRepositorySelectionContext } from '../../context/use-document-repository-selection-context'
import { useFetchForms } from '../../queries/use-fetch-forms'

export function EmailBulkAction() {
  const notify = useNotify()
  const { fetchForms, isFetching } = useFetchForms()
  const { selectedForms, isBulkActionWorking, setIsBulkActionWorking } =
    useDocumentRepositorySelectionContext()
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false)
  const [files, setFiles] = useState<IFile[]>([])

  const attachEmailForms = async () => {
    try {
      setIsBulkActionWorking(true)

      const files = await fetchForms(selectedForms)

      if (files) {
        setFiles(files)
        setIsEmailDrawerOpen(true)
      }
    } catch (e) {
      notify({
        status: 'error',
        message: 'Forms could not be emailed. Please try again.'
      })
    } finally {
      setIsBulkActionWorking(false)
    }
  }

  return (
    <>
      {isFetching ? (
        <GridActionButton
          label="Preparing..."
          textIcon={<CircularProgress size={25} />}
        />
      ) : (
        <GridActionButton
          label="Email Forms"
          icon={mdiEmail}
          disabled={isBulkActionWorking}
          onClick={attachEmailForms}
        />
      )}

      <SingleEmailComposeDrawer
        isOpen={isEmailDrawerOpen && files.length > 0}
        initialValues={{
          attachments: files
        }}
        onClose={() => setIsEmailDrawerOpen(false)}
        onSent={() => setIsEmailDrawerOpen(false)}
      />
    </>
  )
}
