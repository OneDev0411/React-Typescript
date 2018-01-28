import React from 'react'
import { connect } from 'react-redux'
import { Grid, Col } from 'react-bootstrap'
import cn from 'classnames'
import Teams from './SubBrands/Teams'
import { getBrand } from '../../../../store_actions/brandConsole/index'

class SubBrands extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: null
    }
    this.onSelectItem = this.onSelectItem.bind(this)
  }

  componentDidMount() {
    this.props.getBrand(this.props.brandParent)
  }

  onSelectItem(activeItem) {
    if (activeItem !== this.state.activeItem) {
      this.setState({ activeItem })
    } else {
      this.setState({ activeItem: null })
    }
  }

  render() {
    const { brands, brandParent } = this.props

    return (
      <div className="brands">
        <i
          className={cn('fa fa-spinner fa-pulse fa-fw fa-3x spinner__brands', { hide_spinner: !this.props.spinner })}
        />
        <Grid className="table">
          <div className="header">
            <Col md={4} sm={4} xs={4}>Teams name</Col>
          </div>
          {brands &&
          <Teams
            brands={brands}
            brandParent={brandParent}
          />
          }
        </Grid>
      </div>
    )
  }
}

export default connect(
  ({ brandConsole, data }) => ({
    brands: brandConsole.brands,
    spinner: brandConsole.spinner,
    brandParent: data.user.brand
  }),
  ({ getBrand })
)(SubBrands)
