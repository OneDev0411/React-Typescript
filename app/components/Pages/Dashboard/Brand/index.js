import React from 'react'
import { connect } from 'react-redux'
import { Row, Tab } from 'react-bootstrap'
import { getContacts, getTags } from '../../../../store_actions/contact'
import Roles from './Roles'
import Sidebar from './Sidebar'

class Contacts extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.init()
  }

  async init() {
    const { dispatch, contacts } = this.props

    // get contacts
    if (!contacts.list)
      dispatch(getContacts())

    // get tags
    if (!contacts.tags)
      dispatch(getTags())
  }

  render() {
    return (
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
  }
}

export default connect(state => ({
  contacts: state.contact
}))(Contacts)
