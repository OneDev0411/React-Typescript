import React, { Component } from 'react'
import { connect } from 'react-redux'
import Members from '../Compose'
import { getMembers, addMembers, deleteRoles, deleteMembers } from '../../../../../store_actions/brandConsole'
import { Row, Col } from 'react-bootstrap'
import cn from 'classnames'
import UserAvatar from '../../../../Partials/UserAvatar'

class Column extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeRow: null
    }
    this.addMembers = this.addMembers.bind(this)
  }

  componentDidMount() {
    this.props.getMembers(this.props.role)
  }

  getRowAvatar(User) {
    const { activeRow } = this.state
    const size = 30
    const color = '#d7d7d7'

    return <UserAvatar
      userId={User.id}
      name={User.display_name}
      image={User.profile_image_url}
      size={size}
      color={color}
      showStateIndicator={false}
      borderColor={User.id === activeRow ? '#2196f3' : '#303E4D'}
    />
  }

  getRowTitle(title) {
    const len = 20
    if (title.length <= len)
      return title
    return `${title.substr(0, len)}...`
  }

  addMembers(members) {
    this.props.addMembers(this.props.role, members)
  }

  onSelectRow(activeRow) {
    this.setState({ activeRow })
  }

  render() {
    const { activeRow } = this.state
    return (
      <div className="column">
        <div
          onClick={() => this.props.onSelectRole(this.props.role.id)}
          className={cn('title', { active: this.props.activeRole })}
        >
          {this.props.role.role}
          {this.props.activeRole &&
          <i
            onClick={() => {
              this.props.deleteRoles(this.props.role)
            }}
            className="fa fa-times closeIcon"
            aria-hidden="true"
          />
          }
        </div>
        <div className="members">
          <Members
            addMembers={this.addMembers}
            members={this.props.members}
            iconSize={14}
          />
          {this.props.members.map(row =>
            <Row
              onClick={() => this.onSelectRow(row.id)}
              key={`MEMBER_${this.props.role.id}_${row.id}`}
              className={cn('item', { active: row.id === activeRow })}
            >
              <Col sm={1} xs={1} className="avatar vcenter">
                { this.getRowAvatar(row) }
              </Col>
              <Col
                sm={8}
                xs={8}
                className={cn('memberName vcenter')}
              >
                <span>
                  { this.getRowTitle(row.display_name) }
                </span>
              </Col>
              {row.id === activeRow &&
              <i
                onClick={() => {
                  this.props.deleteMembers(this.props.role, row.id)
                }}
                className="fa fa-times closeIcon"
                aria-hidden="true"
              />
              }
            </Row>
          )}
        </div>
      </div>
    )
  }
}


export default connect(
  ({ brandConsole, data }, { role }) => ({
    members: brandConsole.members[role.id] || [],
    user: data.user
  }),
  ({ getMembers, addMembers, deleteRoles, deleteMembers })
)(Column)