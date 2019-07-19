import React, { Fragment } from 'react'

import { MultipleContactsSelect } from 'components/Forms/MultipleContactsSelect'

import { ExtraButton } from './styled'

export function To({ showCc, showBcc, onCcAdded, onBccAdded, ...otherProps }) {
  return (
    <MultipleContactsSelect
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
