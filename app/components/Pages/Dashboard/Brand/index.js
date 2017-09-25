import React from 'react'
import { connect } from 'react-redux'
import { Tab } from 'react-bootstrap'
import cn from 'classnames'
import Checklists from './Checklists'
import Sidebar from './Sidebar'

const Brand = ({ spinner, params }) => (
  <div className="brand">
    <i
      className={cn('fa fa-spinner fa-pulse fa-fw fa-3x spinner__brands', { hide_spinner: !spinner })}
    />
    <Tab.Container id="brand-console-tabs" defaultActiveKey="Checklists">
      <div className="clearfix">
        <Sidebar />
        <div className="rightPanel">
          <Tab.Content animation>
            <Tab.Pane eventKey="Checklists">
              <Checklists
                brand={params.id}
              />
            </Tab.Pane>
          </Tab.Content>
        </div>
      </div>
    </Tab.Container>
  </div>
)
export default connect(
  ({ brandConsole, data }) => ({
    brands: brandConsole.brands,
    spinner: brandConsole.spinner
  })
)(Brand)