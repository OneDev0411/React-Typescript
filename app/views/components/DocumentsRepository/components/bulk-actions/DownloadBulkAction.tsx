import { CircularProgress } from '@material-ui/core'
import { mdiDownload } from '@mdi/js'
import { saveAs } from 'file-saver'

import useNotify from '@app/hooks/use-notify'
import { urlToBlob } from '@app/utils/url-to-blob'

import { GridActionButton } from '../../../Grid/Table/features/Actions/Button'
import { useDocumentRepositorySelectionContext } from '../../context/use-document-repository-selection-context'
import { useFetchForms } from '../../queries/use-fetch-forms'

export function DownloadBulkAction() {
  const { fetchForms, isFetching } = useFetchForms()
  const notify = useNotify()
  const { selectedForms, isBulkActionWorking, setIsBulkActionWorking } =
    useDocumentRepositorySelectionContext()

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
          icon={mdiDownload}
          disabled={isBulkActionWorking}
          onClick={downloadForms}
        />
      )}
    </>
  )
}
