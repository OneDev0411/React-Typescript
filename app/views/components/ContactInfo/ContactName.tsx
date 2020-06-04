import React from 'react'

import Alink from 'components/ALink'

import { ContactsListType } from '../../../components/Pages/Dashboard/MarketingInsights/Insight/types'

interface ContactNamePropsType {
  data: ContactsListType
}

function ContactName({ data }: ContactNamePropsType) {
  const name = data.display_name || data.to

  if (!name) {
    return null
  }

  if (data.contact) {
    return (
      <Alink to={`/dashboard/contacts/${data.contact}`} noStyle>
        {name}
      </Alink>
    )
  }

  return <span>{name}</span>
}

export default ContactName
