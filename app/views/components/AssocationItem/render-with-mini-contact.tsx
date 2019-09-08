import React from 'react'

import MiniContact from '../MiniContact'

export function renderWithMiniContact(WrappedComponent) {
  return function WrappedAssociationItem(props) {
    return props.association.association_type === 'contact' ? (
      <MiniContact type="contact" data={props.association.contact}>
        <WrappedComponent {...props} />
      </MiniContact>
    ) : (
      <WrappedComponent {...props} />
    )
  }
}
