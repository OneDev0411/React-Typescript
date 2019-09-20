import React, { useState, useEffect, useCallback } from 'react'

import { getAlertFeed } from 'models/listings/alerts/get-alert-feed'

import AlertViewerModal from './AlertViewerModal'

interface Props {
  alert: any
  isOpen: boolean
  onClose: () => void
}

export default function AlertFeedModalViewer({
  alert,
  isOpen,
  onClose
}: Props) {
  const [feed, setFeed] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchFeed = useCallback(async () => {
    let feed = []
    const alertId = alert.id
    const roomId = alert.room

    setIsLoading(true)

    try {
      const response = await getAlertFeed(alertId, roomId)

      if (response) {
        feed = response[alertId]
      }
    } catch (error) {
      console.log(error)
    }

    setFeed(feed)
    setIsLoading(false)
  }, [alert.id, alert.room])

  useEffect(() => {
    if (isOpen && !isLoading && feed.length === 0) {
      fetchFeed()
    }
  }, [isOpen, isLoading, fetchFeed, feed.length])

  const handleClose = () => {
    onClose()
    setFeed([])
  }

  return (
    <AlertViewerModal
      feed={feed}
      isOpen={isOpen}
      isLoading={isLoading}
      onClose={handleClose}
    />
  )
}
