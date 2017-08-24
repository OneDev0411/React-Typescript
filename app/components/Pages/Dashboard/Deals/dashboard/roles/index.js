import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import UserAvatar from '../../../../../Partials/UserAvatar'
import AddRole from './add-role'

class Roles extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { deal } = this.props
    const { roles } = deal

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

        <AddRole
          dealId={deal.id}
          roles={roles}
        />
      </div>
    )
  }
}

export default connect(null)(Roles)
