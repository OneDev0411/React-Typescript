import { SectionCollection } from '@app/hooks/use-marketing-center-sections'
import { SectionsEnum } from '@app/views/components/PageSideNav/types'
import { PageTabs, TabLink, MegaTab } from '@app/views/components/PageTabs'

import MegaMenu from './SectionMegaMenu'
import { TabMarketingSkeleton } from './Skeleton'

interface Props {
  sections: SectionCollection
  mediums: { [key: string]: IMarketingTemplateMedium[] }
  templateTypes: string
  isMyDesignsActive: boolean
  isOverviewActive: boolean
}

const MarketingTabs = ({
  sections,
  mediums,
  templateTypes,
  isMyDesignsActive,
  isOverviewActive
}: Props) => {
  const sectionsList = Object.keys(sections).map(
    sectionKey => sections[sectionKey]
  )

  const getActiveTab = () => {
    if (isOverviewActive) {
      return sectionsList.find(
        section =>
          section.type === SectionsEnum.Link && section.key === 'overview'
      )?.key
    }

    if (isMyDesignsActive) {
      return sectionsList.find(
        section =>
          section.type === SectionsEnum.Link && section.key === 'designs'
      )?.key
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
    return <TabMarketingSkeleton />
  }

  return (
    <PageTabs
      defaultValue={getActiveTab()}
      hasMegaMenu
      tabs={sectionsList.map(section => {
        // Only render link type as a tab link
        if (section.type === SectionsEnum.Link) {
          return section.items.map(linkItem => (
            <TabLink
              key={linkItem.value as string}
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
            data-tour-id={`tab-${section.title?.toLowerCase()}`}
            render={({ close }) => <MegaMenu data={section} onClose={close} />}
          />
        )
      })}
    />
  )
}

export default MarketingTabs
