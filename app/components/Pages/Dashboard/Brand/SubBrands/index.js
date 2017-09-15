import React from 'react'
import { connect } from 'react-redux'
import { Grid, Col } from 'react-bootstrap'
import Header from './Header'
import Row from './Row'
import { deleteChecklist, getBrands } from '../../../../../store_actions/brandConsole'

class Checklists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: null
    }
    this.onSelectItem = this.onSelectItem.bind(this)
  }

  componentDidMount() {
    this.props.getBrands(this.props.user.brand)
  }

  onSelectItem(activeItem) {
    if (activeItem !== this.state.activeItem)
      this.setState({ activeItem })
    else
      this.setState({ activeItem: null })
  }

  render() {
    const brands = this.props.brands
    console.log(brands)
    return (
      <div className="brands">
        <Header
          user={this.props.user}
        />
        <Grid className="table">
          <div className="header">
            <Col md={4} sm={4} xs={4}>Checklist Name</Col>
            <Col md={2} sm={2} xs={2}>Deal Type</Col>
            <Col md={2} sm={2} xs={2}>Property Type</Col>
            <Col md={2} sm={2} xs={2}>Order</Col>
          </div>
          <Row
            brands={brands}
          />
        </Grid>
      </div>
    )
  }
}

export default connect(
  ({ brandConsole, data }) => ({
    Checklists: brandConsole.checklists || [],
    brands: brandConsole.brands || [],
    user: data.user
  }),
  ({ deleteChecklist, getBrands })
)(Checklists)
