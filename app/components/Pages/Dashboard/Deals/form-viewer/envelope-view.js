import React from 'react'
import Viewer from './viewer'
import WhoSigned from './who-signed'

import PageHeader from '../../../../../views/components/PageHeader'

export default ({ deal, onClose, envelope, file }) => (
  <div className="c-deal-form-viewer">
    <PageHeader title={file.name} />

    <div className="c-deal-form-viewer__body show-envelopes">
      <Viewer width="calc(100% - 375px)" file={file} />

      <div className="envelopes" style={{ width: '375px' }}>
        <WhoSigned deal={deal} envelope={envelope} onClose={onClose} />
      </div>
    </div>
  </div>
)
