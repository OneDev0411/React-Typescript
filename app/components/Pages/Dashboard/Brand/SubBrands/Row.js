import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import BrandHeader from './BrnadHaedr'
import Tasks from './Tasks'
import Forms from './Forms'

class Row extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: null
    }
    this.onSelectItem = this.onSelectItem.bind(this)
    this.renderRecursive = this.renderRecursive.bind(this)
  }

  onSelectItem(activeItem) {
    if (activeItem !== this.state.activeItem)
      this.setState({ activeItem })
    else
      this.setState({ activeItem: null })
  }

  renderRecursive(brand) {
    return (
      <Accordion activeKey={`Brand_${this.state.activeItem}`}>
        <Panel
          key={`Brand_${brand.id}`}
          eventKey={`Brand_${brand.id}`}
          header={<BrandHeader
            brand={brand}
            onSelectItem={this.onSelectItem}
            deleteBrand={this.props.deleteBrand}
            activeItem={this.state.activeItem === brand.id}
          />}
        >
          {
            brand.brands && brand.brands.map(brandItem => this.renderRecursive(brandItem))
          }
        </Panel>
      </Accordion>
    )
  }

  render() {
    return (
      <div>
        {this.renderRecursive(this.props.brands)}
      </div>
    )
  }
}

export default Row