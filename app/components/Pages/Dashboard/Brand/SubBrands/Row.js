import React from 'react'
import { Panel, PanelGroup } from 'react-bootstrap'
import BrandHeader from './BrnadHaedr'

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
      <Panel
        collapsible
        expanded={brand.collapsed}
        key={`Brand_${brand.id}`}
        eventKey={`Brand_${brand.id}`}
        header={<BrandHeader
          brand={brand}
          onSelectItem={this.onSelectItem}
          deleteBrand={this.props.deleteBrand}
          activeItem={this.state.activeItem === brand.id}
        />}
      >
        add brand
        <div className="child-brand">
          {
            brand.brands && brand.brands.map(brandItem => this.renderRecursive(this.props.brands[brandItem]))
          }
        </div>
      </Panel>
    )
  }

  render() {
    return (
      <div>
        {this.props.brands[this.props.brandParent] && this.renderRecursive(this.props.brands[this.props.brandParent])}
      </div>
    )
  }
}

export default Row