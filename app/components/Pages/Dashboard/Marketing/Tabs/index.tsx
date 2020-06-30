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
  const {
    marketingCenter,
    newsletters,
    celebrations,
    holidays,
    properties,
    branding,
    layouts
  } = sections

  const checkValidTemplateTypes = (items: SectionItem[]) => {
    return _findIndex(items, (i: SectionItem) => {
      const val = Array.isArray(i.value) ? i.value.join(',') : i.value

      return val === templateTypes
    })
  }

  const getActiveTab = () => {
    if (templateTypes) {
      if (checkValidTemplateTypes(branding.items) >= 0) {
        return branding.key
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
        ...newsletters.items.map(i => (
          <TabLink key={i.link} to={i.link} value={i.link} label={i.title} />
        )),
        <MegaTab
          key={celebrations.key}
          value={celebrations.key}
          label={celebrations.title}
          render={({ close }) => (
            <MegaMenu data={celebrations} mediums={mediums} onClose={close} />
          )}
        />,
        <MegaTab
          key={holidays.key}
          value={holidays.key}
          label={holidays.title}
          render={({ close }) => (
            <MegaMenu data={holidays} mediums={mediums} onClose={close} />
          )}
        />,
        <MegaTab
          key={properties.key}
          value={properties.key}
          label={properties.title}
          render={({ close }) => (
            <MegaMenu data={properties} mediums={mediums} onClose={close} />
          )}
        />,
        <MegaTab
          key={branding.key}
          value={branding.key}
          label={branding.title}
          render={({ close }) => (
            <MegaMenu data={branding} mediums={mediums} onClose={close} />
          )}
        />,
        <MegaTab
          key={layouts.key}
          value={layouts.key}
          label={layouts.title}
          render={({ close }) => (
            <MegaMenu data={layouts} mediums={mediums} onClose={close} />
          )}
        />
      ]}
    />
  )
}

export default MarketingTabs
