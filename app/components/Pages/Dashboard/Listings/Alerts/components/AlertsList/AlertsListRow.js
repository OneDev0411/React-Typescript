import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import Brand from '../../../../../../../controllers/Brand'
import setSelectedAlert from '../../../../../../../store_actions/listings/alerts/setSelectedAlert'

const SheredByUsers = ({ users }) =>
  <p className="c-alertList__item__shared-by">
    {users.map((user, index) => user.first_name || user.email).join(', ')}
  </p>

const AlertListRow = ({ alert, isSelected, onClick }) =>
  <div
    className={`c-alertList__item ${isSelected
      ? 'c-alertList__item--selected'
      : ''}`}
    onClick={() => onClick(alert.id)}>
    <div className="c-alertList__item__thumbnail">
      <img src={alert.cover_image_url} alt="mls alert list item - rechat" />
    </div>
    <div className="c-alertList__item__info">
      <h3 className="c-alertList__item__title san-fran ellipses">
        {alert.title || alert.proposed_title || 'without title'}
      </h3>
      {alert.users && <SheredByUsers users={users} />}
    </div>
    <span
      className="c-alertList__item__badge"
      style={{ backgroundColor: `#${Brand.color('primary', '3388ff')}` }}>
      19
    </span>
  </div>

export default compose(
  connect(null, { setSelectedAlert }),
  withHandlers({
    onClick: ({ setSelectedAlert }) => item => {
      setSelectedAlert(item)
    }
  })
)(AlertListRow)
