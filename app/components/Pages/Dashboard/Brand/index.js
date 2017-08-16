import React from 'react'
import { Row, Tab } from 'react-bootstrap'
import Roles from './Roles'
import Sidebar from './Sidebar'

const Brand = () => (
  <div className="brand">
    <Tab.Container defaultActiveKey="Roles">
      <Row className="clearfix">
        <Sidebar />
        <div className="rightPanel">
          <Tab.Content animation>
            <Tab.Pane eventKey="Appearance">
              Not ready yet....
            </Tab.Pane>
            <Tab.Pane eventKey="Roles">
              <Roles />
            </Tab.Pane>
            <Tab.Pane eventKey="Checklist">
              Not ready yet....
            </Tab.Pane>
          </Tab.Content>
        </div>
      </Row>
    </Tab.Container>
  </div>
)

export default Brand