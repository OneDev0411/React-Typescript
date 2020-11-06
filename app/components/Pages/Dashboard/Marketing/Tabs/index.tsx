import React from 'react'

import { PageTabs, TabLink, MegaTab } from 'components/PageTabs'
import { SectionsEnum } from 'components/PageSideNav/types'
import { SectionCollection } from 'hooks/use-marketing-center-sections'

import MegaMenu from './SectionMegaMenu'

interface Props {
  sections: SectionCollection
  mediums: { [key: string]: MarketingTemplateMedium[] }
  templateTypes: string
}

const MarketingTabs = ({ sections, mediums, templateTypes }: Props) => {
  const sectionsList = Object.keys(sections).map(
    sectionKey => sections[sectionKey]
  )

  const getActiveTab = () => {
    if (!templateTypes) {
      return sectionsList.find(section => section.type === SectionsEnum.Link)
        ?.key
    }

    return sectionsList.find(section => {
      if (section.type === SectionsEnum.Link) {
        return section.items.some(item => item.value === templateTypes)
      }

      return section.items.find(item => {
        return Array.isArray(item.value)
          ? item.value.join(',') === templateTypes
          : item.value === templateTypes
      })
    })?.key
  }

  // Do not render menus before getting all mediums
  // We're doing this to prevent sections/tabs flashing
  if (Object.keys(mediums).length === 0) {
    return null
  }

  return (
    <PageTabs
      defaultValue={getActiveTab()}
      hasMegaMenu
      tabs={sectionsList.map(section => {
        // Do not render empty mega menus and their related tabs
        const currentMegaTabTemplatesMediums = section.items.map(item =>
          Array.isArray(item.value) ? item.title : item.value
        )

        if (
          currentMegaTabTemplatesMediums.every(
            item => item && (!mediums[item] || mediums[item].length === 0)
          )
        ) {
          return null
        }

        // Only render link type as a tab link
        if (section.type === SectionsEnum.Link) {
          return section.items.map(linkItem => (
            <TabLink
              key={linkItem.value}
              to={linkItem.link}
              value={section.key}
              label={linkItem.title}
            />
          ))
        }

        // Only render list type as a mega menu
        return (
          <MegaTab
            key={section.key}
            value={section.key}
            label={section.title}
            render={({ close }) => (
              <MegaMenu data={section} mediums={mediums} onClose={close} />
            )}
          />
        )
      })}
    />
  )
}

export default MarketingTabs
