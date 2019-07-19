import React from 'react'

import Alink from 'components/ALink'

import { ContactsListType } from 'dashboard/MarketingInsights/Insight/types'

interface ContactNamePropsType {
  data: ContactsListType
}

function ContactName(props: ContactNamePropsType) {
  const name = props.data.display_name

  if (!name) {
    return null
  }

  if (props.data.contact) {
    return (
      <Alink to={`/dashboard/contacts/${props.data.contact}`}>{name}</Alink>
    )
  }

  return <span>{name}</span>
}

export default ContactName
