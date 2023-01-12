import { CircularProgress } from '@material-ui/core'
import { mdiDownload } from '@mdi/js'
import { saveAs } from 'file-saver'

import useNotify from '@app/hooks/use-notify'
import { useUnsafeUser } from '@app/hooks/use-unsafe-user'
import { urlToBlob } from '@app/utils/url-to-blob'

import { GridActionButton } from '../../../Grid/Table/features/Actions/Button'
import { useDocumentRepositorySelectionContext } from '../../context/use-document-repository-selection-context'
import { useFetchForms } from '../../queries/use-fetch-forms'

export function DownloadBulkAction() {
  const { fetchForms, isFetching } = useFetchForms()
  const notify = useNotify()
  const { selectedForms, isBulkActionWorking, setIsBulkActionWorking } =
    useDocumentRepositorySelectionContext()

  const user = useUnsafeUser()
  const isDisabled = (user?.agents?.length ?? 0) === 0

  const downloadForms = async () => {
    try {
      setIsBulkActionWorking(true)

      const files = await fetchForms(selectedForms)

      if (!files) {
        return
      }

      await Promise.all(
        files.map(async file => {
          const blob = await urlToBlob(file.url)

          saveAs(blob, file.name)
        })
      )
    } catch (e) {
      notify({
        status: 'error',
        message: 'Forms could not be downloaded. Please try again.'
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
          label="Download Forms"
          tooltip={
            isDisabled
              ? 'Your account does not allow you to download forms.'
              : ''
          }
          icon={mdiDownload}
          disabled={isDisabled || isBulkActionWorking}
          onClick={downloadForms}
        />
      )}
    </>
  )
}
