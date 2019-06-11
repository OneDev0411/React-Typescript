import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { browserHistory } from 'react-router'

import TemplatesList from 'components/TemplatesList'
import { getSelectedMediumTemplates } from 'components/TemplatesList/helpers'

import { Header } from './Header'
import { headers } from './Header/data'
import useTemplatesList from './useTemplatesList'
import { getMediums, getTabName } from './helpers'
import { Tab, ListView } from './styled'

const mediumsCollection = {
  FacebookCover: 'Facebook Covers',
  InstagramStory: 'Instagram Stories',
  LinkedInCover: 'Linked In Covers'
}

function Templates(props) {
  const selectedType = headers[props.types]
  const [templates, isLoading] = useTemplatesList(props.types)
  const tabs = getMediums(templates)
  const selectedMedium = getTabName(props.medium, tabs)
  const availableTemplates = getSelectedMediumTemplates(
    templates,
    selectedMedium
  )

  useEffect(() => {
    if (selectedMedium) {
      browserHistory.push(
        `/dashboard/marketing/${props.types}/${selectedMedium}`
      )
    }
  }, [props.types, selectedMedium])

  return (
    <React.Fragment>
      <Helmet>
        <title>{selectedType.title} | Marketing | Rechat</title>
      </Helmet>

      <Header
        data={selectedType}
        isSideMenuOpen={props.isSideMenuOpen}
        toggleSideMenu={props.toggleSideMenu}
        types={props.types}
      />

      <ListView>
        <TemplatesList
          items={availableTemplates}
          isLoading={isLoading}
          type={props.type}
          medium={selectedMedium}
          titleRenderer={() => (
            <ul className="tabs">
              {tabs.map((medium, index) => (
                <li key={index}>
                  <Tab
                    inverse
                    to={`/dashboard/marketing/${props.types}/${medium}`}
                    selected={selectedMedium === medium}
                  >
                    {mediumsCollection[medium] || medium}
                  </Tab>
                </li>
              ))}
            </ul>
          )}
        />
      </ListView>
    </React.Fragment>
  )
}

export default Templates
