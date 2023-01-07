import { useState } from 'react'

import { CircularProgress } from '@material-ui/core'
import { mdiEmail } from '@mdi/js'

import { SingleEmailComposeDrawer } from '../../../EmailCompose'
import { GridActionButton } from '../../../Grid/Table/features/Actions/Button'
import { useFetchForms } from '../../queries/use-fetch-forms'

interface Props {
  selectedForms: UUID[]
}

export function EmailBulkAction({ selectedForms }: Props) {
  const { fetchForms, isFetching } = useFetchForms()
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false)
  const [files, setFiles] = useState<IFile[]>([])

  const attachEmailForms = async () => {
    const files = await fetchForms(selectedForms)

    if (files) {
      setFiles(files)
      setIsEmailDrawerOpen(true)
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
          onClick={attachEmailForms}
        />
      )}

      <SingleEmailComposeDrawer
        isOpen={isEmailDrawerOpen && files.length > 0}
        initialValues={{
          attachments: files
        }}
        onClose={() => setIsEmailDrawerOpen(false)}
        onSent={() => {}}
      />
    </>
  )
}
