import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Tab } from 'react-bootstrap'
import cn from 'classnames'
import Checklists from './Checklists'
import Roles from './Roles'
import Sidebar from './Sidebar'

const Brand = ({ spinner, params, user }) => {
  if (user && user.brand === null) {
    browserHistory.push('/oops')
    return null
  }

  return (
    <div className="brand">
      <i
        className={cn('fa fa-spinner fa-pulse fa-fw fa-3x spinner__brands', { hide_spinner: !spinner })}
      />
      <Tab.Container id="brand-console-tabs" defaultActiveKey="Roles">
        <div className="clearfix">
          <Sidebar />
          <div className="rightPanel">
            <Tab.Content animation>
              <Tab.Pane eventKey="Checklists">
                <Checklists
                  brand={params.id}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="Roles">
                <Roles
                  brand={params.id}
                />
              </Tab.Pane>
            </Tab.Content>
          </div>
        </div>
      </Tab.Container>
    </div>
  )
}
export default connect(
  ({ brandConsole, data, user }) => ({
    brands: brandConsole.brands,
    spinner: brandConsole.spinner,
    user
  })
)(Brand)