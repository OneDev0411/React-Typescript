import React from 'react'

import ContactItem from './ContactItem'
import ListItem from './ListItem'

/**
 * @return {null}
 */
export function RecipientItem({ recipient, input }) {
  switch (recipient.type) {
    case 'tag':
    case 'list':
      return <ListItem recipient={recipient} input={input} />
    default:
      return <ContactItem recipient={recipient} input={input} />
  }
}
