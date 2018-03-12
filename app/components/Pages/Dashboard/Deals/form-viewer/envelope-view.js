import React from 'react'
import { Button } from 'react-bootstrap'
import Viewer from './viewer'
import WhoSigned from './who-signed'

export default ({ deal, onClose, envelope, file }) => (
  <div className="c-deal-form-viewer">
    <div className="c-deal-form-viewer__header">
      <div>
        <h1 className="c-deal-form-viewer__header__title">{file.name}</h1>
      </div>
      <div className="c-deal-form-viewer__header__cta">
        <Button onClick={onClose} className="close-btn">
          X
        </Button>
      </div>
    </div>

    <div className="c-deal-form-viewer__body show-envelopes">
      <Viewer width="calc(100% - 375px)" file={file} />

      <div className="envelopes" style={{ width: '375px' }}>
        <WhoSigned deal={deal} envelope={envelope} onClose={onClose} />
      </div>
    </div>
  </div>
)
