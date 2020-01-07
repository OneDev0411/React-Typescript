import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import pluralize from 'pluralize'

import PageHeader from 'components/PageHeader'
import { Trigger as MenuTrigger } from 'components/SlideMenu'

interface Props {
  listsLength: number
  isSideMenuOpen: boolean
  onSideMenuTriggerClick: () => void
  onMergeAllClick: () => Promise<void>
}

export default function Header({
  listsLength,
  isSideMenuOpen,
  onSideMenuTriggerClick,
  onMergeAllClick
}: Props) {
  const [isMerging, setIsMerging] = useState(false)

  const getMergeAllButtonCopy = () => {
    const possiblePluralizedList = pluralize('contacts list', listsLength, true)

    if (isMerging) {
      return `Merging ${possiblePluralizedList}`
    }

    return `Merge ${possiblePluralizedList}`
  }

  const handleMergeAll = async () => {
    setIsMerging(true)

    await onMergeAllClick()

    setIsMerging(false)
  }

  return (
    <PageHeader style={{ height: '5.0625rem' }}>
      <PageHeader.Title showBackButton={false}>
        <MenuTrigger isOpen={isSideMenuOpen} onClick={onSideMenuTriggerClick} />
        <PageHeader.Heading>Duplicate Contacts</PageHeader.Heading>
      </PageHeader.Title>
      {listsLength > 0 && (
        <PageHeader.Menu>
          <Button
            variant="contained"
            color="primary"
            disabled={isMerging}
            onClick={handleMergeAll}
          >
            {getMergeAllButtonCopy()}
          </Button>
        </PageHeader.Menu>
      )}
    </PageHeader>
  )
}
