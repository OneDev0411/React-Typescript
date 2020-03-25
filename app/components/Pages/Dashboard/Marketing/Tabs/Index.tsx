import React from 'react'

import { PageTabs, Tab, TabLink } from 'components/PageTabs'
import { SectionCollectionTypes } from 'hooks/use-marketing-center-sections'

import MegaMenu from './SectionMegaMenu'

interface Props {
  templateTypes: string
  sections: SectionCollectionTypes
  mediums: string[]
}

export const ContactsTabs = ({ templateTypes, sections, mediums }: Props) => {
  const { marketingCenter, life, properties } = sections
  const keys: string[] = [life.key, properties.key]

  const renderMegaMenu = ({ selectedTab, close }) => {
    switch (selectedTab) {
      case life.key:
        return <MegaMenu data={life} mediums={mediums} onClose={close} />
      case properties.key:
        return <MegaMenu data={properties} mediums={mediums} onClose={close} />
      default:
        return null
    }
  }

  return (
    <PageTabs
      tabs={[
        ...marketingCenter.items.map(i => (
          <TabLink key={i.link} to={i.link} value={i.link} label={i.title} />
        )),
        <Tab key={life.key} value={life.key} label={life.title} />,
        <Tab
          key={properties.key}
          value={properties.key}
          label={properties.title}
        />
      ]}
      onShowMegamenuStats={keys}
      megaMenu={props => renderMegaMenu(props)}
    />
  )
}

export default ContactsTabs
