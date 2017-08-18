import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getMembers, addMembers, deleteRoles, deleteMembers } from '../../../../../store_actions/brandConsole'
import { Row, Col } from 'react-bootstrap'

class Column extends Component {

  constructor(props) {
    super(props)
    this.addMembers = this.addMembers.bind(this)
  }

  componentDidMount() {
    // this.props.getMembers(this.props.role)
  }

  addMembers(members) {
    this.props.addMembers(this.props.role, members)
  }


  render() {
    const { Checklist } = this.props
    return (
      <div
        className="checklistRow"
      >
        <Col
          md={4}
          sm={4}
          xs={4}
          className="column"
        >
          <i className="fa fa-caret-right icon" aria-hidden="true"/>
          {Checklist.title}
        </Col>
        <Col
          md={2}
          sm={2}
          xs={2}
          className="column"
          style={{ overflow: 'hidden' }}
          onClick={() => this.open(Checklist.id)}
        >
          {Checklist.deal_type}
        </Col>
        <Col
          md={2}
          sm={2}
          xs={2}
          className="column"
          onClick={() => this.open(Checklist.id)}
        >
          {Checklist.property_type}
        </Col>
        <Col
          md={2}
          sm={2}
          xs={2}
          className="column"
          onClick={() => this.open(Checklist.id)}
        >
          {Checklist.order}
        </Col>
        <Col
          md={2}
          sm={2}
          xs={2}
          className="column"
          onClick={() => this.open(Checklist.id)}
        >
          <Col
            md={8}
            sm={8}
            xs={8} className="editButton">
            Edit
          </Col>
          <Col
            md={4}
            sm={4}
            xs={4}
            className="deleteIcon"
          >
            <i
              onClick={() => {
                this.props.deleteMembers(this.props.role, row.id)
              }}
              className="fa fa-times"
              aria-hidden="true"
            />
          </Col>
        </Col>
      </div>
    )
  }
}


export default connect(
  ({ brandConsole, data }, { checklist }) => ({
    // members: brandConsole.members[checklist.id] || [],
    // user: data.user
  }),
  ({ getMembers, addMembers, deleteRoles, deleteMembers })
)(Column)