import React from 'react'

import ContactItem from './ContactItem'
import ListItem from './ListItem'

export function RecipientItem(props) {
  if (['tag', 'list'].includes(props.recipient.data_type)) {
    return <ListItem {...props} />
  }

  return <ContactItem {...props} />
}
