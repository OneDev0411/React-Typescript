import { useMemo, useRef, useState } from 'react'

import { changeUrl } from '@app/utils/change-url'

export const useContactDetailsModalState = (
  defaultCallbackUrl = '',
  contacts?: UUID[]
) => {
  const [currentContactId, setCurrentContactId] = useState<Nullable<UUID>>(null)
  const callbackUrl = useRef<string>(defaultCallbackUrl)

  const currentContactIndex = useMemo(() => {
    if (!currentContactId || !contacts) {
      return -1
    }

    return contacts.indexOf(currentContactId)
  }, [contacts, currentContactId])

  const handleOpenContact = (id: UUID) => {
    changeUrl(`/dashboard/contacts/${id}`)
    setCurrentContactId(id)
  }

  const onOpenContact = (id: UUID) => {
    callbackUrl.current = `${window.location.pathname}${window.location.search}${window.location.hash}`
    handleOpenContact(id)
  }

  const onCloseContact = () => {
    changeUrl(callbackUrl.current ?? defaultCallbackUrl)
    setCurrentContactId(null)
  }

  const onNextContact = () => {
    if (!currentContactId || !contacts || currentContactIndex === -1) {
      return
    }

    const nextContactId =
      currentContactIndex === contacts.length - 1
        ? contacts[0]
        : contacts[currentContactIndex + 1]

    handleOpenContact(nextContactId)
  }

  const onPreviousContact = () => {
    if (!currentContactId || !contacts || currentContactIndex === -1) {
      return
    }

    const previousContactId =
      currentContactIndex === 0
        ? contacts[contacts.length - 1]
        : contacts[currentContactIndex - 1]

    handleOpenContact(previousContactId)
  }

  const nextButtonDisabled =
    !contacts || contacts[contacts.length - 1] === currentContactId

  const previousButtonDisabled = !contacts || contacts[0] === currentContactId

  return {
    currentContactId,
    onOpenContact,
    onCloseContact,
    onNextContact,
    onPreviousContact,
    nextButtonDisabled,
    previousButtonDisabled
  }
}
