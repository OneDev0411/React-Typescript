import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import Header from './Header'
import ChecklistRow from './Row'
import { getChecklists } from '../../../../../store_actions/brandConsole'

class Checklists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: null
    }
    this.onSelectItem = this.onSelectItem.bind(this)
  }

  componentDidMount() {
    this.props.getChecklists(this.props.user)
  }

  onSelectItem(activeItem) {
    this.setState({ activeItem })
  }

  render() {
    const Checklists = this.props.Checklists
    console.log('Checklists: ', Checklists)
    return (
      <div className="checklists">
        <Header
          user={this.props.user}
        />
        <Grid className="table">
          <div className="header">
            <Col md={4} sm={4} xs={4}>Checklist Name</Col>
            <Col md={3} sm={3} xs={3}>Deal Type</Col>
            <Col md={2} sm={2} xs={2}>Property Type</Col>
            <Col md={3} sm={3} xs={3}>Order</Col>
          </div>
          {Checklists.map(Checklist =>
            <ChecklistRow
              key={`Checklist${Checklist.id}`}
              Checklist={Checklist}
              onSelectItem={this.onSelectItem}
              activeItem={this.state.activeItem === Checklist.id}
            />
          )}
        </Grid>
      </div>
    )
  }
}

export default connect(
  ({ brandConsole, data }) => ({
    Checklists: brandConsole.checklists || [],
    user: data.user
  }),
  ({ getChecklists })
)(Checklists)
