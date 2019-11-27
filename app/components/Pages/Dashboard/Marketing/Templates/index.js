import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { browserHistory } from 'react-router'

import { getActiveTeamId } from 'utils/user-teams'
import TemplatesList from 'components/TemplatesList'
import { getSelectedMediumTemplates } from 'utils/marketing-center/helpers'

import { Header } from '../components/PageHeader'

import { TYPES_TITLE, MEDIUMS_COLLECTION } from './constants'
import useTemplatesList from './useTemplatesList'
import { getMediums, getTabName } from './helpers'
import { Tab, Tabs } from './styled'

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

      <TemplatesList
        items={availableTemplates}
        isLoading={isLoading}
        type={props.types}
        medium={selectedMedium}
        titleRenderer={() => (
          <Tabs className="tabs">
            <div className="tabs-inneer">
              {tabs.map((medium, index) => (
                <Tab
                  noStyle
                  key={index}
                  selected={selectedMedium === medium}
                  to={`/dashboard/marketing/${props.types}/${medium}`}
                >
                  {MEDIUMS_COLLECTION[medium] || medium}
                </Tab>
              ))}
            </div>
          </Tabs>
        )}
      />
    </React.Fragment>
  )
}

export default connect(state => ({
  user: state.user
}))(Templates)
