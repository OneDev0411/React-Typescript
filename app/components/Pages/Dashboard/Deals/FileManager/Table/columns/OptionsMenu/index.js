import React from 'react'

import { BasicDropdown } from 'components/BasicDropdown'
import VerticalDotsIcon from 'components/SvgIcons/MoreVert/IconMoreVert'

export default class OptionsMenu extends React.Component {
  get MenuItems() {
    const menuItems = [
      {
        label: 'Delete',
        onClick: file => this.props.handleDelete(file)
      }
    ]

    if (this.props.isPdfDocument) {
      menuItems.push({
        label: 'Split PDF',
        onClick: file => this.props.handleSplit(file)
      })
    }

    return menuItems
  }

  render() {
    if (this.props.file.envelope) {
      return false
    }

    return (
      <BasicDropdown
        pullTo="right"
        upsideDown={this.props.totalRows - this.props.rowId === 0}
        style={{ textAlign: 'right' }}
        buttonRenderer={props => <VerticalDotsIcon {...props} />}
        items={this.MenuItems}
        onChange={item => item.onClick(this.props.file)}
      />
    )
  }

  // return (
  //   <Dropdown
  //         id={`file_${file.id}`}
  //         className="deal-file-cta-menu"
  //         pullRight
  //       >
  //         <OptionButton
  //           appearance="icon"
  //           onClick={e => e.stopPropagation()}
  //           // className="cta-btn btn-link"
  //           bsRole="toggle"
  //         >
  //           <VerticalDotsIcon />
  //         </OptionButton>

  //         <Dropdown.Menu>
  //           <li>
  //             {isDeleting.includes(file.id) ? (
  //               <span>
  //                 <Spinner /> Deleting ...
  //               </span>
  //             ) : (
  //               <span onClick={() => this.deleteSingleFile(file)}>
  //                 Delete file
  //               </span>
  //             )}
  //           </li>
  //         </Dropdown.Menu>
  //       </Dropdown>
  // )
}
