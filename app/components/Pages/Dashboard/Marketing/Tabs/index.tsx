import React from 'react'
import _findIndex from 'lodash/findIndex'

import { PageTabs, TabLink, MegaTab } from 'components/PageTabs'
import { SectionItem } from 'components/PageSideNav/types'
import { SectionCollection } from 'hooks/use-marketing-center-sections'

import MegaMenu from './SectionMegaMenu'

interface Props {
  sections: SectionCollection
  mediums: { [key: string]: string[] }
  templateTypes: string
}

const MarketingTabs = ({ sections, mediums, templateTypes }: Props) => {
  const { marketingCenter, life, properties } = sections

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

  return (
    <PageTabs
      defaultValue={getActiveTab()}
      hasMegaMenu
      tabs={[
        ...marketingCenter.items.map(i => (
          <TabLink key={i.link} to={i.link} value={i.link} label={i.title} />
        )),
        <MegaTab
          key={life.key}
          value={life.key}
          label={life.title}
          render={({ close }) => (
            <MegaMenu data={life} mediums={mediums} onClose={close} />
          )}
        />,
        <MegaTab
          key={properties.key}
          value={properties.key}
          label={properties.title}
          render={({ close }) => (
            <MegaMenu data={properties} mediums={mediums} onClose={close} />
          )}
        />
      ]}
    />
  )
}

export default MarketingTabs
