import { SectionsEnum } from 'components/PageSideNav/types'
import { PageTabs, TabLink, MegaTab } from 'components/PageTabs'
import { SectionCollection } from 'hooks/use-marketing-center-sections'

import MegaMenu from './SectionMegaMenu'
import { TabMarketingSkeleton } from './Skeleton'

interface Props {
  sections: SectionCollection
  categories: IMarketingTemplateCategories
  templateTypes: string
  isLoading: boolean
  isMyDesignsActive: boolean
  isOverviewActive: boolean
}

const MarketingTabs = ({
  sections,
  categories,
  templateTypes,
  isLoading,
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

  // Do not render menus before getting all categories
  // We're doing this to prevent sections/tabs flashing
  if (isLoading) {
    return <TabMarketingSkeleton />
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
            item => item && (!categories[item] || categories[item].length === 0)
          )
        ) {
          return null
        }

        // Only render link type as a tab link
        if (section.type === SectionsEnum.Link) {
          return section.items.map(linkItem => (
            <TabLink
              key={linkItem.value as string}
              to={linkItem.link}
              value={section.key}
              label={categories[section.key]?.label || linkItem.title}
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
            render={({ close }) => (
              <MegaMenu
                data={section}
                categories={categories}
                onClose={close}
              />
            )}
          />
        )
      })}
    />
  )
}

export default MarketingTabs
