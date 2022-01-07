import { useEffect, useState } from 'react'

import useNotify from '@app/hooks/use-notify'
import { importCsv } from '@app/models/contacts/import-csv'
import { uploadCsvFile } from '@app/models/contacts/upload-csv'

import { normalizeMappedFields } from '../helpers/normalize-mapped-fields'
import { MappedField } from '../types'

export function useUploadContacts(
  owner: IUser,
  file: Nullable<File>,
  mappedFields: Record<string, Nullable<MappedField>>
): [() => void, boolean, Nullable<string>] {
  const [isUploadingContacts, setIsUploadingContacts] = useState(false)
  const notify = useNotify()

  const [error, setError] = useState<Nullable<string>>(null)
  const uploadContacts = async () => {
    if (error) {
      notify({
        status: 'error',
        message: error
      })

      return
    }

    setIsUploadingContacts(true)

    const fileData = await uploadCsvFile(file!)

    importCsv(fileData.id, owner.id, normalizeMappedFields(mappedFields))
  }

  useEffect(() => {
    let error: Nullable<string> = null

    if (Object.values(mappedFields).every(field => !field)) {
      error = 'To upload contacts, you must connect at least one field'
    }

    setError(error)
  }, [mappedFields])

  useEffect(() => {
    window.socket.on('contact:import', ({ state }) => {
      console.log(`Server Status: ${state}`)

      if (state !== 'complete') {
        setIsUploadingContacts(false)

        notify({
          status: 'error',
          message: 'The upload failed. We recommend that you try again.'
        })

        return
      }

      notify({
        status: 'success',
        message: 'The list has been uploaded to your contacts.'
      })

      window.location.href = '/dashboard/contacts'
    })

    return () => {
      window.socket.off('contact:import')
    }
  }, [notify])

  return [uploadContacts, isUploadingContacts, error]
}
