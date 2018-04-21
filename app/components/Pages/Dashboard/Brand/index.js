import React from 'react'
import { connect } from 'react-redux'
import { Grid, Col } from 'react-bootstrap'
import cn from 'classnames'
import { browserHistory } from 'react-router'
import Teams from './SubBrands/Teams'
import { getBrand } from '../../../../store_actions/brandConsole/index'
import { getActiveTeamId } from '../../../../utils/user-teams'
import { getActiveTeamACL } from '../../../../utils/user-teams'

class SubBrands extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: null
    }
    this.onSelectItem = this.onSelectItem.bind(this)
    this.brandParent = getActiveTeamId(this.props.user)
  }
  componentWillMount() {
    const { user } = this.props
    const acl = getActiveTeamACL(user)
    const hasBackOfficePermission = acl.includes('BackOffice')

    !hasBackOfficePermission && browserHistory.push('/dashboard/mls')
  }

  componentDidMount() {
    this.props.getBrand(this.brandParent)
  }

  onSelectItem(activeItem) {
    if (activeItem !== this.state.activeItem) {
      this.setState({ activeItem })
    } else {
      this.setState({ activeItem: null })
    }
  }

  render() {
    const { brands } = this.props

    return (
      <div className="brands">
        <i
          className={cn('fa fa-spinner fa-pulse fa-fw fa-3x spinner__brands', {
            hide_spinner: !this.props.spinner
          })}
        />
        <Grid className="table">
          <div className="header">
            <Col md={4} sm={4} xs={4}>
              Teams name
            </Col>
          </div>
          {brands && <Teams brands={brands} brandParent={this.brandParent} />}
        </Grid>
      </div>
    )
  }
}

export default connect(
  ({ brandConsole, user }) => ({
    brands: brandConsole.brands,
    spinner: brandConsole.spinner,
    user
  }),
  { getBrand }
)(SubBrands)
