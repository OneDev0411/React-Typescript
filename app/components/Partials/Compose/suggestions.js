import React from 'react'
import { Row, Col } from 'react-bootstrap'
import cn from 'classnames'
import UserAvatar from '../UserAvatar'

export default ({
  dropDownBox,
  searching,
  viewList,
  onBlurDropDownBox,
  onAdd
}) => {
  /**
   * get entry hint
   */
  function getSubTitle({ email, phone_number, display_name }) {
    if (email && email !== display_name)
      return email
    else if (phone_number && phone_number !== display_name)
      return phone_number
    return ''
  }

  /**
   * get styles of suggestions
   */
  function getStyles() {
    const style = {}

    if (dropDownBox === true && _.size(viewList) === 0 && !searching)
      style.display = 'none'

    return style
  }

  return (
    <div className="sg-container">
      <div
        className={cn('suggestions', { dropdown: dropDownBox === true })}
        style={getStyles()}
        tabIndex="1"
        onBlur={() => onBlurDropDownBox()}
      >
        {
          searching &&
          <img
            className="loader"
            src="/static/images/loading-states/three-dots-blue.svg"
          />
        }

        {
          _.map(viewList, recp =>
            <Row
              key={`RECP_SUG_${recp.id}`}
              className="item"
              onClick={() => onAdd(recp)}
            >
              <Col sm={1} xs={1} md={1} className="vcenter" style={{ padding: 0 }}>
                <UserAvatar
                  showStateIndicator={false}
                  name={recp.display_name}
                  image={recp.image}
                  size={35}
                />
              </Col>

              <Col sm={8} xs={8} md={8} className="vcenter">
                <strong>{ recp.display_name }</strong>
                <div style={{ color: '#9b9a9b' }}>
                  { getSubTitle(recp) }
                </div>
              </Col>
            </Row>
          )
        }
      </div>
    </div>
  )
}
