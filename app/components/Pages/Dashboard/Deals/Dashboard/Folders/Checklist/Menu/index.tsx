import React from 'react'

import { mdiDotsVertical } from '@mdi/js'

import { MenuItem, IconButton, makeStyles, Theme } from '@material-ui/core'

import { BaseDropdown } from 'components/BaseDropdown'
// import { connect } from 'react-redux'
// import { addNotification as notify } from 'reapop'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

// import { updateChecklist } from 'actions/deals'
// import { confirmation } from 'actions/confirmation'

// import Spinner from 'components/Spinner'
// import { BasicDropdown } from 'components/BasicDropdown'

// import { Loading } from './styled'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      marginLeft: theme.spacing(1)
    }
  }),
  {
    name: 'ChecklistMenu'
  }
)

interface Props {
  deal: IDeal
  checklist: IDealChecklist
  isBackOffice: boolean
}

export function FolderOptionsMenu({ deal, checklist, isBackOffice }: Props) {
  const classes = useStyles()

  const handleToggleTerminate = () => {}

  const handleToggleDeactivate = () => {}

  if (
    deal.is_draft ||
    (!checklist.is_terminatable && !checklist.is_deactivatable)
  ) {
    return null
  }

  return (
    <BaseDropdown
      renderDropdownButton={props => (
        <IconButton size="small" {...props} className={classes.root}>
          <SvgIcon path={mdiDotsVertical} />
        </IconButton>
      )}
      renderMenu={({ close }) => (
        <div>
          <MenuItem
            onClick={() => {
              close()
              handleToggleTerminate()
            }}
          >
            {checklist.is_terminated ? 'Active' : 'Terminate'}
          </MenuItem>

          <MenuItem
            onClick={() => {
              close()
              handleToggleDeactivate()
            }}
          >
            {checklist.is_deactivated
              ? 'Make this a primary offer'
              : 'Make this a back up offer'}
          </MenuItem>
        </div>
      )}
    />
  )
}
// class ChecklistMenu extends React.Component {
//   state = {
//     isWorking: false
//   }

//   get MenuItems() {
//     const { checklist, isBackOffice } = this.props
//     const list = []

//     if (isBackOffice && checklist.is_terminatable) {
//       list.push({
//         label: checklist.is_terminated ? 'Active' : 'Terminate',
//         onClick: this.terminateChecklist
//       })
//     }

//     if (isBackOffice && checklist.is_deactivatable) {
//       list.push({
//         label: checklist.is_deactivated
//           ? 'Make this a primary offer'
//           : 'Make this a back up offer',
//         onClick: this.deactivateChecklist
//       })
//     }

//     return list
//   }

//   terminateChecklist = async () => {
//     const { checklist } = this.props

//     this.setState({ isWorking: true })

//     try {
//       await this.props.updateChecklist(this.props.deal.id, checklist.id, {
//         ...checklist,
//         is_terminated: !checklist.is_terminated
//       })

//       this.props.notify({
//         message: `The checklist has been ${
//           checklist.is_terminated ? 'activated' : 'terminated'
//         }`,
//         status: 'success'
//       })
//     } catch (e) {
//       console.log(e)
//     }

//     this.setState({ isWorking: false })
//   }

//   deactivateChecklist = async () => {
//     const { checklist } = this.props

//     this.setState({ isWorking: true })

//     try {
//       await this.props.updateChecklist(this.props.deal.id, checklist.id, {
//         ...checklist,
//         is_deactivated: !checklist.is_deactivated
//       })

//       this.props.notify({
//         message: `The checklist has been changed to ${
//           checklist.is_deactivated ? 'primary' : 'backup'
//         } offer`,
//         status: 'success'
//       })
//     } catch (e) {
//       console.log(e)
//     }

//     this.setState({ isWorking: false })
//   }

//   render() {
//     if (this.state.isWorking) {
//       return (
//         <Loading>
//           <Spinner />
//         </Loading>
//       )
//     }

//     const menuItems = this.MenuItems

//     if (menuItems.length === 0) {
//       return false
//     }

//     return (
//       <BasicDropdown
//         pullTo="right"
//         style={{ margin: '0.25rem -0.75rem 0 0' }}
//         buttonRenderer={props => <SvgIcon path={mdiDotsVertical} {...props} />}
//         items={menuItems}
//         onChange={item => item.onClick()}
//       />
//     )
//   }
// }

// export default connect(null, { notify, confirmation, updateChecklist })(
//   ChecklistMenu
// )
