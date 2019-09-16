import React, { useState } from 'react'

import { grey } from 'views/utils/colors'
import AlertIcon from 'components/SvgIcons/Bell/IconBell'

import AlertFeedModalViewer from '../../../Listings/components/AlertFeedModalViewer/AlertFeedModalViewer'

export default function AlertMessage({ alert }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="alert">
      <strong style={{ color: grey.A900 }}>Shared a saved search:</strong>

      <div className="alert-widget" onClick={() => setIsModalOpen(true)}>
        <AlertIcon style={{ width: '2rem', height: '2rem' }} />

        <div className="heading">
          <div className="title">{alert.title || 'Saved Search'}</div>
          {alert.proposed_title && (
            <div className="proposed">{alert.proposed_title}</div>
          )}
        </div>
      </div>

      <AlertFeedModalViewer
        alert={alert}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
