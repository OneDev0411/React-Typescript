import React from 'react'
import { Tab } from 'react-bootstrap'
import Checklists from './Checklists'
import SubBrands from './SubBrands'
import Sidebar from './Sidebar'

const Brand = () => (
  <div className="brand">
    <Tab.Container id="brand-console-tabs" defaultActiveKey="SubBrands">
      <div className="clearfix">
        <Sidebar />
        <div className="rightPanel">
          <Tab.Content animation>
            <Tab.Pane eventKey="Checklists">
              <Checklists />
            </Tab.Pane>
            <Tab.Pane eventKey="SubBrands">
              <SubBrands />
            </Tab.Pane>
          </Tab.Content>
        </div>
      </div>
    </Tab.Container>
  </div>
)

export default Brand