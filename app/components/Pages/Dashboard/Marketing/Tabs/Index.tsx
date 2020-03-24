import React from 'react'

import { PageTabs, Tab, TabLink } from 'components/PageTabs'
import { ExtendedSectionTypes } from 'hooks/use-marketing-center-sections'

import LifeTab from './Items/Life'

import { MEDIUMS_COLLECTION } from '../constants'

interface Props {
  defaultValue: string
  currentValue: string
  templateTypes: string
  sections: ExtendedSectionTypes
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
  const { life } = sections

  console.log(life)

  return (
    <PageTabs
      defaultValue={defaultValue}
      tabs={[<Tab key={1} value="meg" label={<LifeTab data={life} />} />]}
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
