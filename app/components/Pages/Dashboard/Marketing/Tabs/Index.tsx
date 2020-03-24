import React from 'react'

import { PageTabs, Tab, TabLink } from 'components/PageTabs'
import { SectionItem } from 'components/PageSideNav/types'

import { MEDIUMS_COLLECTION } from '../constants'

interface Props {
  defaultValue: string
  currentValue: string
  templateTypes: string
  sections: SectionItem[]
  mediums: string[]
  router: any
}

export const ContactsTabs = ({
  defaultValue,
  currentValue,
  templateTypes,
  sections,
  mediums,
  router
}: Props) => {
  return (
    <PageTabs
      defaultValue={defaultValue}
      tabs={[<Tab key={1} value="meg" label="tmp tab" />]}
      actions={mediums.map(medium => {
        const url = `/dashboard/marketing/${templateTypes}/${medium}`

        return (
          <TabLink
            key={medium}
            label={MEDIUMS_COLLECTION[medium] || medium}
            value={medium}
            to={url}
          />
        )
      })}
    />
  )
}

export default ContactsTabs
