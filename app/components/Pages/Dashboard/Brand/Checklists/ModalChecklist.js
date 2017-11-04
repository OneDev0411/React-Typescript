import React from 'react'
import cn from 'classnames'
import { Modal, Button, DropdownButton, MenuItem } from 'react-bootstrap'

class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showComposeModal: false,
      titleChecklist: props.checklist && props.checklist.title,
      tabName: props.tabName && props.checklist.tabName,
      titleDealType: props.checklist && props.checklist.deal_type,
      titlePropertyDealType: props.checklist && props.checklist.property_type,
      order: props.checklist && props.checklist.order,
      isTerminatable: props.checklist && props.checklist.is_terminatable,
      isDeactivatable: props.checklist && props.checklist.is_deactivatable
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.checklist
      && nextProps.activeItem
    ) {
      this.setState({
        titleChecklist: nextProps.checklist.title,
        tabName: nextProps.checklist.tab_name,
        titleDealType: nextProps.checklist.deal_type,
        titlePropertyDealType: nextProps.checklist.property_type,
        order: nextProps.checklist.order,
        isTerminatable: nextProps.checklist.is_terminatable,
        isDeactivatable: nextProps.checklist.is_deactivatable
      })
    }
  }

  onChangeComposeModal = showComposeModal => this.setState({ showComposeModal })
  changeTitleChecklist = titleChecklist => this.setState({ titleChecklist })
  changeTabName = tabName => this.setState({ tabName })
  changeTitleDealType = titleDealType => this.setState({ titleDealType })
  changeTitlePropertyType = titlePropertyDealType => this.setState({ titlePropertyDealType })
  changeTitleOrder = order => this.setState({ order })
  changeIsTerminatable = isTerminatable => this.setState({ isTerminatable })
  changeIsDeactivatable = isDeactivatable => this.setState({ isDeactivatable })

  render() {
    return <ModalNewChecklist
      {...this.props}
      showComposeModal={this.state.showComposeModal}
      titleChecklist={this.state.titleChecklist}
      tabName={this.state.tabName}
      titleDealType={this.state.titleDealType}
      titlePropertyDealType={this.state.titlePropertyDealType}
      order={this.state.order}
      isTerminatable={this.state.isTerminatable}
      isDeactivatable={this.state.isDeactivatable}
      onChangeComposeModal={this.onChangeComposeModal}
      changeTitleChecklist={this.changeTitleChecklist}
      changeTabName={this.changeTabName}
      changeTitleDealType={this.changeTitleDealType}
      changeTitlePropertyType={this.changeTitlePropertyType}
      changeTitleOrder={this.changeTitleOrder}
      changeIsTerminatable={this.changeIsTerminatable}
      changeIsDeactivatable={this.changeIsDeactivatable}
    />
  }
}

const ModalNewChecklist = ({
  TriggerButton,
  title,
  buttonTitle,
  onButtonClick,
  inline = false,
  showOnly = false,
  /* internal props and states */
  showComposeModal,
  onChangeComposeModal,
  titleChecklist,
  changeTitleChecklist,
  titleDealType,
  changeTitleDealType,
  titlePropertyDealType,
  changeTitlePropertyType,
  order,
  changeTitleOrder,
  isTerminatable = false,
  changeIsTerminatable,
  isDeactivatable = false,
  changeIsDeactivatable,
  tabName,
  changeTabName
}) => {
  const dealTypes = [
    'any', 'Buying', 'Selling'
  ]
  const propertyTypes = [
    'any', 'Resale', 'New Home', 'Lot / Land', 'Residential Lease', 'Commercial Sale', 'Commercial Lease'
  ]

  return <div style={{ display: inline ? 'inline' : 'block' }}>
    <TriggerButton
      clickHandler={() => onChangeComposeModal(!showComposeModal)}
    />

    <Modal
      show={showComposeModal}
      dialogClassName="modal-checklist"
      onHide={() => onChangeComposeModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="title">Title</div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Write a checklist name…"
            value={titleChecklist}
            onChange={(event) => changeTitleChecklist(event.target.value)}
          />
        </div>
        <div className="title">Tab name</div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Write a tab name…"
            value={tabName}
            onChange={(event) => changeTabName(event.target.value)}
          />
        </div>
        <div className="title">Deal Type</div>
        <DropdownButton
          id="dealTypes"
          title={titleDealType || 'any'}
          onSelect={(selectedItem) => changeTitleDealType(selectedItem)}
        >
          {dealTypes.map(item =>
            <MenuItem
              key={item}
              eventKey={item}
            >{item}
            </MenuItem>
          )}
        </DropdownButton>
        <div className="title">Property Type</div>
        <DropdownButton
          id="propertyTypes"
          title={titlePropertyDealType || 'any'}
          onSelect={(selectedItem) => changeTitlePropertyType(selectedItem)}
        >
          {propertyTypes.map(item =>
            <MenuItem
              key={item}
              eventKey={item}
            >{item}
            </MenuItem>
          )}
        </DropdownButton>
        <div className="title">Order</div>
        <div className="input-container">
          <input
            type="text"
            pattern="\d*"
            value={order}
            placeholder="order…"
            onChange={(event) => changeTitleOrder(event.target.value)}
          />
        </div>
        <div >
          <div className="title">Checklist can be terminated?</div>
          <Button
            className={cn('checkBoxIcon', { active: isTerminatable })}
            onClick={() => changeIsTerminatable(!isTerminatable)}
          >
            <i
              className="fa fa-check"
              aria-hidden="true"
            />
          </Button>
          <span className="checkBoxText">Yes</span>
          <Button
            className={cn('checkBoxIcon', { active: !isTerminatable })}
            onClick={() => changeIsTerminatable(!isTerminatable)}
          >
            <i
              className="fa fa-check"
              aria-hidden="true"
            />
          </Button>
          <span className="checkBoxText">No</span>
        </div>
        <div >
          <div className="title">Checklist can be deactivated?</div>
          <Button
            className={cn('checkBoxIcon', { active: isDeactivatable })}
            onClick={() => changeIsDeactivatable(!isDeactivatable)}
          >
            <i
              className="fa fa-check"
              aria-hidden="true"
            />
          </Button>
          <span className="checkBoxText">Yes</span>
          <Button
            className={cn('checkBoxIcon', { active: !isDeactivatable })}
            onClick={() => changeIsDeactivatable(!isDeactivatable)}
          >
            <i
              className="fa fa-check"
              aria-hidden="true"
            />
          </Button>
          <span className="checkBoxText">No</span>
        </div>
      </Modal.Body>

      {!showOnly &&
      <Modal.Footer>
        <Button
          bsStyle="primary"
          onClick={() => {
            onChangeComposeModal(false)

            let titlePropertyDealTypeNullable = titlePropertyDealType

            if (titlePropertyDealType === 'any')
              titlePropertyDealTypeNullable = null

            let titleDealTypeNullable = titleDealType

            if (titlePropertyDealType === 'any')
              titleDealTypeNullable = null

            onButtonClick({
              title: titleChecklist,
              deal_type: titleDealTypeNullable,
              property_type: titlePropertyDealTypeNullable,
              order,
              is_terminatable: isTerminatable,
              is_deactivatable: isDeactivatable,
              tab_name: tabName
            })
          }}
        >
          {buttonTitle}
        </Button>
      </Modal.Footer>}
    </Modal>
  </div>
}
export default Wrapper
