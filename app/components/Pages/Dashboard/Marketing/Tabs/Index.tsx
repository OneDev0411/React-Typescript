import React from 'react'

import { PageTabs, Tab } from 'components/PageTabs'
import { SectionCollectionTypes } from 'hooks/use-marketing-center-sections'

import LifeTab from './Items/Life'
import PropertiesTab from './Items/Properties'

// import { MEDIUMS_COLLECTION } from '../constants'

interface Props {
  defaultValue: string
  currentValue: string
  templateTypes: string
  sections: SectionCollectionTypes
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
  const keys = Object.keys(sections)

  const { life, properties } = sections

  const renderMegaMenu = state => {
    switch (state) {
      case life.key:
        return <LifeTab data={life} />
      case properties.key:
        return <PropertiesTab data={properties} />
      default:
        return null
    }
  }

  return (
    <PageTabs
      tabs={[
        <Tab key={1} value={life.key} label={life.title} />,
        <Tab key={2} value={properties.key} label={properties.title} />
      ]}
      onShowMegamenuStats={keys}
      megaMenu={({ selectedTab }) => renderMegaMenu(selectedTab)}
    />
  )
}

export default ContactsTabs
