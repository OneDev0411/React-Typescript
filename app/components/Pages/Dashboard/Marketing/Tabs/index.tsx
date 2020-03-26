import React from 'react'
import _findIndex from 'lodash/findIndex'

import { PageTabs, Tab, TabLink } from 'components/PageTabs'
import { SectionItem } from 'components/PageSideNav/types'
import { SectionCollection } from 'hooks/use-marketing-center-sections'

import MegaMenu from './SectionMegaMenu'

interface Props {
  sections: SectionCollection
  mediums: string[]
  templateTypes: string
}

const ContactsTabs = ({ sections, mediums, templateTypes }: Props) => {
  const { marketingCenter, life, properties } = sections
  const keys: string[] = [life.key, properties.key]

  const checkValidTemplateTypes = (items: SectionItem[]) => {
    return _findIndex(items, (i: SectionItem) => {
      const val = Array.isArray(i.value) ? i.value.join(',') : i.value

      return val === templateTypes
    })
  }

  const getActiveTab = () => {
    if (templateTypes) {
      if (checkValidTemplateTypes(life.items) >= 0) {
        return life.key
      }

      if (checkValidTemplateTypes(properties.items) >= 0) {
        return properties.key
      }
    }

    return marketingCenter.items[0].link
  }
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
      defaultValue={getActiveTab()}
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
