import React from 'react'
import { Helmet } from 'react-helmet'

import TemplatesList from 'components/TemplatesList'

import { Header } from '../components/PageHeader'

const title = 'Blank Layouts'

const blankTemplates = [
  {
    id: '6a57cb08-fa35-11e8-a26d-0a95998482ac',
    name: 'social-static2',
    template_type: 'Birthday',
    medium: 'Social',
    url: '/static/images/mc/ig.jpg',
    // THIS SHOULD BE DELETE, JUST FOR TEST
    tempUrl: true,
    variant: 'BusinessPress',
    inputs: [],
    mjml: false,
    type: 'template'
  }
]

function BlankLayouts(props) {
  return (
    <React.Fragment>
      <Helmet>
        <title>{title} | Marketing | Rechat</title>
      </Helmet>
      <Header
        title={title}
        isSideMenuOpen={props.isSideMenuOpen}
        toggleSideMenu={props.toggleSideMenu}
      />
      <TemplatesList items={blankTemplates} titleRenderer={null} />
    </React.Fragment>
  )
}

export default BlankLayouts
