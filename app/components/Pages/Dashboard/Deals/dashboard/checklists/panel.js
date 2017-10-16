import React from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown, Panel } from 'react-bootstrap'
import VerticalDotsIcon from '../../../Partials/Svgs/VerticalDots'
import TaskTermination from './termination'
import TaskDeactivation from './deactivation'
import Labels from './labels'

class ChecklistPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false
    }
  }

  toggleMenu() {
    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  getActions(checklist) {
    const { isBackoffice } = this.props

    return {
      termination: isBackoffice && checklist.is_terminatable,
      deactivation: checklist.is_deactivatable
    }
  }

  render() {
    const { isBackoffice, checklist, deal } = this.props
    const { showMenu } = this.state

    // get actions and valid actions count
    const actions = this.getActions(checklist)

    return (
      <Panel
        collapsible
        defaultExpanded
        className="checklist"
        header={
          <div>
            <div className="crt">
              <i className="fa fa-caret-down p-icon" />
            </div>

            <div className="s-info">
              <span className="p-title">
                { checklist.title }
              </span>

              <Labels
                checklist={checklist}
              />
            </div>

            {
              _.filter(actions, available => available).length > 0 &&
              <div className="cta">
                <Dropdown
                  id={`CHKLST_CTA_${checklist.id}`}
                  className="deal-checklist-cta-menu"
                  open={showMenu}
                  onToggle={() => this.toggleMenu()}
                  pullRight
                >
                  <Button
                    className="cta-btn btn-link"
                    bsRole="toggle"
                    onClick={e => e.stopPropagation()}
                  >
                    <VerticalDotsIcon
                      width={20}
                      height={20}
                      fill="#8da2b5"
                    />
                  </Button>

                  <Dropdown.Menu>
                    <TaskTermination
                      hasPermission={actions.termination}
                      deal={deal}
                      checklist={checklist}
                      onRequestCloseDropDownMenu={() => this.toggleMenu()}
                    />

                    <TaskDeactivation
                      hasPermission={actions.deactivation}
                      deal={deal}
                      checklist={checklist}
                      isBackoffice={isBackoffice}
                      onRequestCloseDropDownMenu={() => this.toggleMenu()}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            }
          </div>
        }
      >
        { this.props.children }
      </Panel>
    )
  }
}

export default connect(({ deals }) => ({
  isBackoffice: deals.backoffice
}))(ChecklistPanel)

