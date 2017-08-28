import React from 'react'
import { Tab } from 'react-bootstrap'
import Roles from './Roles'
import Checklists from './Checklists'
import Sidebar from './Sidebar'

const Brand = () => (
  <div className="brand">
    <Tab.Container defaultActiveKey="Checklists">
      <div className="clearfix">
        <Sidebar />
        <div className="rightPanel">
          <Tab.Content animation>
            <Tab.Pane eventKey="Appearance">
              Not ready yet....
            </Tab.Pane>
            <Tab.Pane eventKey="Roles">
              <Roles />
            </Tab.Pane>
            <Tab.Pane eventKey="Checklists">
              <Checklists />
            </Tab.Pane>
          </Tab.Content>
        </div>
      </div>
    </Tab.Container>
  </div>
)

export default Brand