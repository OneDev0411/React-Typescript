import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { Grid } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Header from './Header'
import RowRole from './Row'
import { getRoles } from '../../../../../store_actions/brandConsole'

class Roles extends React.Component {
  constructor(props) {
    super(props)
    this.aclTypes = ['Deals', 'BackOffice', 'Admin']
  }

  componentDidMount() {
    if (this.props.params) {
      this.props.getRoles(this.props.params.brand)
    }
  }

  render() {
    const { roles, spinner } = this.props

    return (
      <div className="brand">
        <i
          className={cn('fa fa-spinner fa-pulse fa-fw fa-3x spinner__brands', {
            hide_spinner: !spinner
          })}
        />
        <div className="checklists">
          <Header brand={this.props.params.brand} aclTypes={this.aclTypes} />
          <Grid className="table">
            <div className="checklist--header">
              <div className="checklist--header--column-flex-2">Role Name</div>
              {this.aclTypes.map((permission, key) => (
                <div key={key} className="checklist--header--column-center">
                  {permission}
                </div>
              ))}
              <div className="checklist--header--column-flex-2" />
            </div>
            {roles.map((role, key) => (
              <RowRole key={key} role={role} aclTypes={this.aclTypes} />
            ))}
          </Grid>
        </div>
      </div>
    )
  }
}

Roles.propTypes = {
  params: PropTypes.object,
  roles: PropTypes.array,
  getRoles: PropTypes.func
}

export default connect(
  ({ brandConsole, data }) => ({
    roles: brandConsole.roles || [],
    spinner: brandConsole.spinner
  }),
  {
    getRoles
  }
)(Roles)
