import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { browserHistory } from 'react-router'

import { getActiveTeamId } from 'utils/user-teams'
import TemplatesList from 'components/TemplatesList'
import { getSelectedMediumTemplates } from 'components/TemplatesList/helpers'

import { Header } from '../components/PageHeader'

import { TYPES_TITLE } from './constants'
import useTemplatesList from './useTemplatesList'
import { getMediums, getTabName } from './helpers'
import { Tab, ListView } from './styled'

const mediumsCollection = {
  FacebookCover: 'Facebook Covers',
  InstagramStory: 'Instagram Stories',
  LinkedInCover: 'LinkedIn Covers'
}

function Templates(props) {
  const title = TYPES_TITLE[props.types]
  const activeTeamId = getActiveTeamId(props.user)
  const [templates, isLoading] = useTemplatesList(activeTeamId, props.types)
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
        <title>{title} | Marketing | Rechat</title>
      </Helmet>

      <Header
        title={title}
        types={props.types}
        isSideMenuOpen={props.isSideMenuOpen}
        toggleSideMenu={props.toggleSideMenu}
      />

      <ListView>
        <TemplatesList
          items={availableTemplates}
          isLoading={isLoading}
          type={props.types}
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

export default connect(state => ({
  user: state.user
}))(Templates)
