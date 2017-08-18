import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import UserAvatar from '../../../../../Partials/UserAvatar'

class Roles extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { deal } = this.props
    const { roles } = deal

    console.log(roles)
    return (
      <div className="deal-roles">
        {
          roles &&
          roles.map(item =>
            <Row key={item.id} className="item">
              <Col sm={2} xs={3} className="vcenter">
                <UserAvatar
                  name={item.user.display_name}
                  image={item.user.profile_image_thumbnail_url}
                  size={40}
                  showStateIndicator={false}
                />
              </Col>

              <Col sm={10} xs={9} className="name vcenter">
                <div>{ item.user.display_name }</div>
                <div className="role">{ item.role }</div>
              </Col>
            </Row>
          )
        }

        <Row className="item add-new">
          <Col sm={2} xs={3} className="vcenter">
            <span className="add-contact-avatar">
              <i className="fa fa-plus" />
            </span>
          </Col>

          <Col sm={10} xs={9} className="name vcenter">
            <div style={{ color: '#61778d' }}>Add Contact</div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(null)(Roles)
