import React, { useEffect } from 'react'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'
import { MenuItem } from '@material-ui/core'

import { useMarketingCenterSections } from 'hooks/use-marketing-center-sections'
import { useMarketingCenterMediums } from 'hooks/use-marketing-center-mediums'

import { getActiveTeamId } from 'utils/user-teams'

import Acl from 'components/Acl'
import PageLayout from 'components/GlobalPageLayout'
import {
  PageTabs,
  Tab,
  TabLink,
  TabSpacer,
  DropdownTab
} from 'components/PageTabs'

import TemplatesList from 'components/TemplatesList'

import { useTemplatesList } from './hooks/use-templates-list'
import { MEDIUMS_COLLECTION } from './constants'

export function Marketing(props) {
  const sections = useMarketingCenterSections()

  const templateTypes = props.params.types

  const activeBrand = getActiveTeamId(props.user)
  const { templates, loading } = useTemplatesList(activeBrand, templateTypes)
  const mediums = useMarketingCenterMediums(templates)

  const currentMedium = props.params.medium
  const currentMediumTemplates = templates.filter(
    item => item.medium === currentMedium
  )

  useEffect(() => {
    if (templateTypes && !currentMedium && mediums.length > 0) {
      props.router.push(`/dashboard/marketing/${templateTypes}/${mediums[0]}`)
    }
  }, [currentMedium, mediums, props.router, templateTypes])

  return (
    <Acl.Marketing fallbackUrl="/dashboard/mls">
      <Helmet>
        <title>Marketing | Rechat</title>
      </Helmet>

      <PageLayout>
        <PageLayout.Header title="Marketing Center" />
        <PageLayout.Main>
          <PageTabs
            defaultValue={props.location.pathname}
            tabs={[
              ...sections.map(section => (
                <Tab
                  key={section.title}
                  value={section.title}
                  label={
                    <DropdownTab title={section.title}>
                      {({ toggleMenu }) => (
                        <>
                          {section.items.map(sectionItem => (
                            <MenuItem
                              key={sectionItem.link}
                              onClick={() => {
                                props.router.push(sectionItem.link)
                                toggleMenu()
                              }}
                            >
                              {sectionItem.title}
                            </MenuItem>
                          ))}
                        </>
                      )}
                    </DropdownTab>
                  }
                />
              )),
              <TabSpacer key="spacer" />,
              [
                ...mediums.map(medium => {
                  const url = `/dashboard/marketing/${templateTypes}/${medium}`

                  return (
                    <TabLink
                      key={medium}
                      label={MEDIUMS_COLLECTION[medium] || medium}
                      value={url}
                      to={url}
                    />
                  )
                })
              ]
            ]}
          />
          <TemplatesList
            items={currentMediumTemplates}
            isLoading={loading}
            type={props.params.types}
            medium={props.params.medium}
          />
        </PageLayout.Main>
      </PageLayout>
    </Acl.Marketing>
  )
}

export default withRouter(Marketing)
