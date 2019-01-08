import React from 'react'
import Flex from 'styled-flex-component'
import { Modal, Button, DropdownButton, MenuItem } from 'react-bootstrap'
import { CheckBoxButtonWithoutState } from '../../../../../views/components/Button/CheckboxButton/CheckboxWithoutState'

class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showComposeModal: false,
      titleChecklist: props.checklist && props.checklist.title,
      tabName: props.checklist && props.checklist.tab_name,
      titleDealType: props.checklist && props.checklist.deal_type,
      titlePropertyDealType: props.checklist && props.checklist.property_type,
      order: props.checklist && props.checklist.order,
      isTerminatable: props.checklist && props.checklist.is_terminatable,
      isDeactivatable: props.checklist && props.checklist.is_deactivatable
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checklist && nextProps.activeItem) {
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
  changeTitlePropertyType = titlePropertyDealType =>
    this.setState({ titlePropertyDealType })
  changeTitleOrder = order => this.setState({ order })
  changeIsTerminatable = isTerminatable => this.setState({ isTerminatable })
  changeIsDeactivatable = isDeactivatable => this.setState({ isDeactivatable })
  clearModal = () =>
    this.setState({
      showComposeModal: false,
      titleChecklist: '',
      tabName: '',
      titleDealType: '',
      titlePropertyDealType: '',
      order: '',
      isTerminatable: false,
      isDeactivatable: false
    })
  render() {
    return (
      <ModalNewChecklist
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
        clearModal={this.clearModal}
      />
    )
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
  changeTabName,
  clearModal
}) => {
  const dealTypes = ['any', 'Buying', 'Selling']
  const propertyTypes = [
    'any',
    'Resale',
    'New Home',
    'Lot / Land',
    'Residential Lease',
    'Commercial Sale',
    'Commercial Lease'
  ]
  const formValid = titleChecklist && tabName && /[1-9]/g.test(order)

  return (
    <div style={{ display: inline ? 'inline' : 'block' }}>
      <TriggerButton
        clickHandler={() => onChangeComposeModal(!showComposeModal)}
      />

      <Modal
        show={showComposeModal}
        dialogClassName="modal-checklist"
        onHide={() => onChangeComposeModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="title">Title</div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Write a checklist name…"
              value={titleChecklist}
              onChange={event => changeTitleChecklist(event.target.value)}
            />
          </div>
          <div className="title">Tab name</div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Write a tab name…"
              value={tabName}
              onChange={event => changeTabName(event.target.value)}
            />
          </div>
          <div className="title">Deal Type</div>
          <DropdownButton
            id="dealTypes"
            title={titleDealType || 'any'}
            onSelect={selectedItem => changeTitleDealType(selectedItem)}
          >
            {dealTypes.map(item => (
              <MenuItem key={item} eventKey={item}>
                {item}
              </MenuItem>
            ))}
          </DropdownButton>
          <div className="title">Property Type</div>
          <DropdownButton
            id="propertyTypes"
            title={titlePropertyDealType || 'any'}
            onSelect={selectedItem => changeTitlePropertyType(selectedItem)}
          >
            {propertyTypes.map(item => (
              <MenuItem key={item} eventKey={item}>
                {item}
              </MenuItem>
            ))}
          </DropdownButton>
          <div className="title">Order</div>
          <div className="input-container">
            <input
              type="text"
              pattern="\d*"
              value={order}
              placeholder="order…"
              onChange={event => changeTitleOrder(event.target.value)}
            />
          </div>
          <div className="title">Checklist can be terminated?</div>
          <Flex alignCenter>
            <CheckBoxButtonWithoutState
              square
              isSelected={isTerminatable}
              onClick={() => changeIsTerminatable(!isTerminatable)}
              style={{ marginRight: '0.5rem' }}
            />
            <span className="checkBoxText">Yes</span>
            <CheckBoxButtonWithoutState
              square
              isSelected={!isTerminatable}
              onClick={() => changeIsTerminatable(!isTerminatable)}
              style={{ marginRight: '0.5rem' }}
            />

            <span className="checkBoxText">No</span>
          </Flex>
          <div className="title">Checklist can be deactivated?</div>
          <Flex alignCenter>
            <CheckBoxButtonWithoutState
              square
              isSelected={isDeactivatable}
              onClick={() => changeIsDeactivatable(!isDeactivatable)}
              style={{ marginRight: '0.5rem' }}
            />

            <span className="checkBoxText">Yes</span>
            <CheckBoxButtonWithoutState
              square
              isSelected={!isDeactivatable}
              onClick={() => changeIsDeactivatable(!isDeactivatable)}
              style={{ marginRight: '0.5rem' }}
            />

            <span className="checkBoxText">No</span>
          </Flex>
        </Modal.Body>

        {!showOnly && (
          <Modal.Footer>
            <Button
              bsStyle="primary"
              disabled={!formValid}
              onClick={() => {
                clearModal()

                let titlePropertyDealTypeNullable = titlePropertyDealType

                if (titlePropertyDealType === 'any') {
                  titlePropertyDealTypeNullable = null
                }

                let titleDealTypeNullable = titleDealType

                if (titlePropertyDealType === 'any') {
                  titleDealTypeNullable = null
                }

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
          </Modal.Footer>
        )}
      </Modal>
    </div>
  )
}
export default Wrapper
