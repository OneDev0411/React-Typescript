import React from 'react'
import { Grid } from '@material-ui/core'
import cn from 'classnames'
import _ from 'underscore'

import UserAvatar from 'components/UserAvatar'

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
    if (email && email !== display_name) {
      return email
    }

    if (phone_number && phone_number !== display_name) {
      return phone_number
    }

    return ''
  }

  /**
   * get styles of suggestions
   */
  function getStyles() {
    const style = {}

    if (dropDownBox === true && _.size(viewList) === 0 && !searching) {
      style.display = 'none'
    }

    return style
  }

  const isWebkit = 'WebkitAppearance' in document.documentElement.style

  return (
    <div
      className="sg-container u-scrollbar"
      data-simplebar={(!isWebkit && _.size(viewList) > 0) || null}
    >
      <div
        className={cn('suggestions', { dropdown: dropDownBox === true })}
        style={getStyles()}
        onBlur={() => onBlurDropDownBox()}
      >
        {searching && (
          <img
            className="loader"
            src="/static/images/loading-states/three-dots-blue.svg"
            alt=""
          />
        )}

        {_.map(viewList, recp => (
          <Grid
            container
            key={`RECP_SUG_${recp.id}`}
            className="item"
            onClick={() => onAdd(recp)}
          >
            <Grid
              item
              sm={1}
              xs={1}
              md={1}
              className="vcenter"
              style={{ padding: 0 }}
            >
              <UserAvatar
                showStateIndicator={false}
                name={recp.display_name}
                image={recp.image}
                size={36}
                color="#000000"
              />
            </Grid>

            <Grid item sm={8} xs={8} md={8} className="vcenter">
              <strong className="suggestions__name">{recp.display_name}</strong>
              <div style={{ color: '#9b9a9b' }}>{getSubTitle(recp)}</div>
            </Grid>
          </Grid>
        ))}
      </div>
    </div>
  )
}
