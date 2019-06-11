import React from 'react'
import { Helmet } from 'react-helmet'

import TemplatesList from 'components/TemplatesList'

import { Header } from '../components/PageHeader'
import useTemplatesHistory from './useTemplatesHistory'

function History(props) {
  const [templates, isLoading] = useTemplatesHistory()

  return (
    <React.Fragment>
      <Helmet>
        <title>My Designs | Marketing | Rechat</title>
      </Helmet>
      <Header
        title="My Designs"
        style={{ padding: '0 1.5rem' }}
        isSideMenuOpen={props.isSideMenuOpen}
        toggleSideMenu={props.toggleSideMenu}
      />
      <TemplatesList type="history" items={templates} isLoading={isLoading} />
    </React.Fragment>
  )
}

export default History
