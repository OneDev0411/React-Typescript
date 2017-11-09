import React from 'react'
import { connect } from 'react-redux'
import { Panel, Button } from 'react-bootstrap'
import BrandHeader from './BrandHeader'
import ModalBrand from './ModalBrand'
import { addBrand } from '../../../../../store_actions/brandConsole'

const Teams = ({
  brands,
  brandParent,
  addBrand
}) => {
  const AddButton = ({
    clickHandler
  }) =>
    (<Button
      className="button button__add-brand"
      onClick={() => clickHandler()}
    >
      Add Team
    </Button>)
  const renderRecursive = (brand) => (
    <Panel
      collapsible
      expanded={brand.collapsed}
      key={`Brand_${brand.id}`}
      eventKey={`Brand_${brand.id}`}
      header={<BrandHeader
        key={`Brand_${brand.id}_header`}
        brand={brand}
      />}
    >
      <div className="add-brand">
        <div className="label__add-brand">Teams</div>
        <ModalBrand
          TriggerButton={AddButton}
          showOnly={false}
          dropDownBox
          inline
          title="Add Team"
          buttonTitle="Add"
          onButtonClick={(newBrand) => {
            addBrand({
              ...newBrand,
              parent: brand.id
            })
          }}
        />
      </div>
      <div className="child-brand">
        {
          brand.brands && brand.brands.map(brandItem => renderRecursive(brands[brandItem]))
        }
      </div>
    </Panel>
  )

  return (
    <div>
      {brands[brandParent] && renderRecursive(brands[brandParent])}
    </div>
  )
}


export default connect(
  null,
  ({ addBrand })
)(Teams)