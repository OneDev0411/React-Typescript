import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Grid, Col, Accordion, Panel } from 'react-bootstrap'
import Header from './Header'
import ChecklistHeader from './HeaderChecklist'
import Tasks from './Tasks'
import Forms from './Forms'
import {
  getChecklists,
  deleteChecklist
} from '../../../../../store_actions/brandConsole'
import { getForms } from '../../../../../store_actions/deals'

class Checklists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: null
    }
    this.onSelectItem = this.onSelectItem.bind(this)
  }

  componentDidMount() {
    this.props.getChecklists(this.props.brand)
    this.props.getForms()
  }

  onSelectItem(activeItem) {
    if (activeItem !== this.state.activeItem)
      this.setState({ activeItem })
    else
      this.setState({ activeItem: null })
  }

  render() {
    const Checklists = this.props.Checklists
    return (
      <div className="checklists">
        <Header
          brand={this.props.brand}
        />
        <Grid className="table">
          <div className="header">
            <Col md={4} sm={4} xs={4}>Checklist Name</Col>
            <Col md={2} sm={2} xs={2}>Deal Type</Col>
            <Col md={2} sm={2} xs={2}>Property Type</Col>
            <Col md={2} sm={2} xs={2}>Order</Col>
          </div>
          <Accordion activeKey={`Checklist_${this.state.activeItem}`}>
            {Checklists.map(checklist =>
              <Panel
                key={`Checklist_${checklist.id}`}
                eventKey={`Checklist_${checklist.id}`}
                header={<ChecklistHeader
                  checklist={checklist}
                  onSelectItem={this.onSelectItem}
                  deleteChecklist={this.props.deleteChecklist}
                  activeItem={this.state.activeItem === checklist.id}
                />}
              >
                <Tasks
                  checklist={checklist}
                />
                <Forms
                  checklist={checklist}
                />
              </Panel>
            )}
          </Accordion>
        </Grid>
      </div>
    )
  }
}

Checklists.propTypes = {
  brand: PropTypes.string,
  Checklists: PropTypes.array,
  getChecklists: PropTypes.func,
  deleteChecklist: PropTypes.func,
  getForms: PropTypes.func
}

export default connect(
  ({ brandConsole, data }) => ({
    Checklists: brandConsole.checklists || []
  }),
  ({ getChecklists, getForms, deleteChecklist })
)(Checklists)
