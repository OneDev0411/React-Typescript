import React from 'react'

import MultiFields from '../components/MultiFields'
import { getContactOriginalSourceTitle } from '../../../../../../../utils/get-contact-original-source-title'

export default function OrginalSource({ contact }) {
  return (
    <MultiFields
      attributeName="source_type"
      contact={contact}
      handleFormat={getContactOriginalSourceTitle}
    />
  )
}
