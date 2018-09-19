import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {
  getContacts,
  removeImportResult
} from '../../../../../store_actions/contacts'
import ModalImportLoading from './ModalImportLoading'
import config from '../../../../../../config/public'
import Button from '../../../../../views/components/Button/ActionButton'
import { BasicDropdown } from '../../../../../views/components/BasicDropdown'
import { primary } from '../../../../../views/utils/colors'

const Item = Button.extend`
  color: #000;

  &:hover {
    color: #fff !important;
    background-color: ${primary};
  }
`

class Import extends React.Component {
  constructor(props) {
    super(props)

    this.url = `${config.api_url}/authorize-ms-graph\
?failEvent=importFail\
&user=${this.props.userId}\
&doneEvent=importDone\
&authSuccessEvent=importSuccesfullLogin\
&client=web`
    this.loginWindows = undefined
  }

  componentWillReceiveProps(nextProps) {
    const { getContacts, removeImportResult } = this.props

    if (
      nextProps.importOutlook.done &&
      this.props.importOutlook.done !== nextProps.importOutlook.done
    ) {
      getContacts()
      removeImportResult()
      this.loginWindows && this.loginWindows.close()
    }

    if (
      nextProps.importOutlook.failLogin &&
      this.props.importOutlook.failLogin !== nextProps.importOutlook.failLogin
    ) {
      removeImportResult()
    }
  }

  items = [
    {
      label: 'Import From CSV',
      onClick: () => browserHistory.push('/dashboard/contacts/import/csv')
    },
    {
      label: 'Connect to Outlook',
      onClick: () => {
        this.loginWindows = window.open(
          this.url,
          'myWindow',
          'width=300,height=500'
        )
      }
    }
  ]

  render() {
    const { SuccessfulLogin } = this.props.importOutlook

    return (
      <React.Fragment>
        <BasicDropdown
          style={{ marginRight: '1rem' }}
          items={this.items}
          onChange={item => item.onClick()}
          buttonText="Import"
          itemRenderer={({ item, ...rest }) => (
            <Item
              appearance="link"
              key={item.label}
              style={{ width: '100%' }}
              {...rest}
            >
              {item.label}
            </Item>
          )}
        />

        <ModalImportLoading show={SuccessfulLogin} />
      </React.Fragment>
    )
  }
}

function mapStateToProps({ user, contacts }) {
  const { importOutlook } = contacts

  return {
    user,
    importOutlook
  }
}

export default connect(
  mapStateToProps,
  { getContacts, removeImportResult }
)(Import)
