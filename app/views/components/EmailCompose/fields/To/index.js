import React, { Fragment } from 'react'

import { ExtraButton } from './styled'

export function To({ showCc, showBcc, onCcAdded, onBccAdded, ...otherProps }) {
  return (
    <ContactsChipsInput
      {...otherProps}
      labelExtra={
        <Fragment>
          {showCc && <ExtraButton onClick={onCcAdded}>Cc</ExtraButton>}
          {showBcc && <ExtraButton onClick={onBccAdded}>Bcc</ExtraButton>}
        </Fragment>
      }
    />
  )
}
