import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { mdiDotsVertical } from '@mdi/js'

import { updateChecklist } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import Spinner from 'components/Spinner'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { BasicDropdown } from 'components/BasicDropdown'

import { Loading } from './styled'

class ChecklistMenu extends React.Component {
  state = {
    isWorking: false
  }

  get MenuItems() {
    const { checklist, isBackOffice } = this.props
    const list = []

    if (isBackOffice && checklist.is_terminatable) {
      list.push({
        label: checklist.is_terminated ? 'Active' : 'Terminate',
        onClick: this.terminateChecklist
      })
    }

    if (isBackOffice && checklist.is_deactivatable) {
      list.push({
        label: checklist.is_deactivated
          ? 'Make this a primary offer'
          : 'Make this a back up offer',
        onClick: this.deactivateChecklist
      })
    }

    return list
  }

  terminateChecklist = async () => {
    const { checklist } = this.props

    this.setState({ isWorking: true })

    try {
      await this.props.updateChecklist(this.props.deal.id, checklist.id, {
        ...checklist,
        is_terminated: !checklist.is_terminated
      })

      this.props.notify({
        message: `The checklist has been ${
          checklist.is_terminated ? 'activated' : 'terminated'
        }`,
        status: 'success'
      })
    } catch (e) {
      console.log(e)
    }

    this.setState({ isWorking: false })
  }

  deactivateChecklist = async () => {
    const { checklist } = this.props

    this.setState({ isWorking: true })

    try {
      await this.props.updateChecklist(this.props.deal.id, checklist.id, {
        ...checklist,
        is_deactivated: !checklist.is_deactivated
      })

      this.props.notify({
        message: `The checklist has been changed to ${
          checklist.is_deactivated ? 'primary' : 'backup'
        } offer`,
        status: 'success'
      })
    } catch (e) {
      console.log(e)
    }

    this.setState({ isWorking: false })
  }

  render() {
    if (this.state.isWorking) {
      return (
        <Loading>
          <Spinner />
        </Loading>
      )
    }

    const menuItems = this.MenuItems

    if (menuItems.length === 0) {
      return false
    }

    return (
      <BasicDropdown
        pullTo="right"
        style={{ margin: '0.25rem -0.75rem 0 0' }}
        buttonRenderer={props => <SvgIcon path={mdiDotsVertical} {...props} />}
        items={menuItems}
        onChange={item => item.onClick()}
      />
    )
  }
}

export default connect(null, { notify, confirmation, updateChecklist })(
  ChecklistMenu
)
