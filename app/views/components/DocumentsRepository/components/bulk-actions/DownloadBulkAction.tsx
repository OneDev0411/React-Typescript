import { CircularProgress } from '@material-ui/core'
import { mdiDownload } from '@mdi/js'
import { saveAs } from 'file-saver'

import { urlToBlob } from '@app/utils/url-to-blob'

import { GridActionButton } from '../../../Grid/Table/features/Actions/Button'
import { useFetchForms } from '../../queries/use-fetch-forms'

interface Props {
  selectedForms: UUID[]
}

export function DownloadBulkAction({ selectedForms }: Props) {
  const { fetchForms, isFetching } = useFetchForms()

  const downloadForms = async () => {
    const files = await fetchForms(selectedForms)

    files?.forEach(async file => {
      const blob = await urlToBlob(file.url)

      saveAs(blob, file.name)
    })
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
          onClick={downloadForms}
        />
      )}
    </>
  )
}
