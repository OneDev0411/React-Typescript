import React, { useState } from 'react'

import { mdiBellOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { grey } from 'views/utils/colors'

import AlertFeedModalViewer from '../../../MLS/components/AlertFeedModalViewer/AlertFeedModalViewer'

export default function AlertMessage({ alert }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="alert">
      <strong style={{ color: grey.A900 }}>Shared a saved search:</strong>

      <div className="alert-widget" onClick={() => setIsModalOpen(true)}>
        <SvgIcon path={mdiBellOutline} leftMargined />

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
