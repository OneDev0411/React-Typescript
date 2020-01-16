import React, { useState } from 'react'
import { Button, makeStyles, Theme } from '@material-ui/core'
import pluralize from 'pluralize'

import PageHeader from 'components/PageHeader'
import { Trigger as MenuTrigger } from 'components/SlideMenu'

const useStyles = makeStyles((theme: Theme) => ({
  dismissAllButton: {
    margin: theme.spacing(0, 1)
  }
}))

interface Props {
  listsLength: number
  isSideMenuOpen: boolean
  onSideMenuTriggerClick: () => void
  onDismissAllClick: () => Promise<void>
  onMergeAllClick: () => Promise<void>
}

export default function Header({
  listsLength,
  isSideMenuOpen,
  onSideMenuTriggerClick,
  onDismissAllClick,
  onMergeAllClick
}: Props) {
  const classes = useStyles()
  const [isMerging, setIsMerging] = useState(false)
  const [isDismissing, setIsDismissing] = useState(false)

  const getDismissAllButtonCopy = () => {
    if (isDismissing) {
      return 'Dismissing'
    }

    return 'Dismiss All'
  }

  const getMergeAllButtonCopy = () => {
    const possiblePluralizedList = pluralize('contacts list', listsLength, true)

    if (isMerging) {
      return `Merging ${possiblePluralizedList}`
    }

    return `Merge ${possiblePluralizedList}`
  }

  const handleDismissAll = async () => {
    setIsDismissing(true)

    await onDismissAllClick()

    setIsDismissing(false)
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
            variant="text"
            color="primary"
            disabled={isMerging || isDismissing}
            onClick={handleDismissAll}
            className={classes.dismissAllButton}
          >
            {getDismissAllButtonCopy()}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={isMerging || isDismissing}
            onClick={handleMergeAll}
          >
            {getMergeAllButtonCopy()}
          </Button>
        </PageHeader.Menu>
      )}
    </PageHeader>
  )
}
