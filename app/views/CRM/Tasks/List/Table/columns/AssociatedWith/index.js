import React from 'react'

import FlexContainer from '../../../../../../components/FlexContainer'

export function AssociatedWithCell({ task }) {
  const { contacts, listings, deals } = task
  const associations = { contacts, deals, listings }

  const getText = (type, many) => {
    if (many === 1) {
      return `1 ${type.substr(0, type.length - 1)}`
    }

    return `${many} ${type}`
  }

  let text = Object.keys(associations)
    .map(association => {
      const value = associations[association]

      if (value) {
        const many = value.length

        if (many > 0) {
          return getText(association, many)
        }
      }
    })
    .filter(a => a)

  if (text.length > 0) {
    text = text.join(', ')
  } else {
    text = 'No associations'
  }

  return <FlexContainer>{text}</FlexContainer>
}
