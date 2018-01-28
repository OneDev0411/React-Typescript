import React from 'react'
import { Base64 } from 'js-base64'
import { connect } from 'react-redux'
import { getContacts } from '../../../../../store_actions/contact'

class ImportOutlook extends React.Component {
  constructor(props) {
    super(props)

    const state = {
      userID: this.props.userId,
      client: 'web',
      doneEvent: '<nameOfEventToCallWhenDataIsReady>',
      redirectURL: '<urlToRedirectUserWhileFetchingDataFromMSGraph>'
    }
    const stateBase64 = Base64.encodeURI(JSON.stringify(state))

    this.url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize\
    ?redirect_uri=http://localhost:3078/ms-auth-redirect\
    &response_type=code%20id_token\
    &response_mode=form_post&client_id=a7e6a3a9-db5e-430f-8024-95ecc91b40eb\
    &state=${stateBase64}\
    &nonce=XRl0OwU2Ow9ODsCEe5Wrp4LoUEgjSGr3\
    &scope=profile\
    %20offline_access%20https://graph.microsoft.com/mail.readwrite\
    %20https://graph.microsoft.com/calendars.readwrite\
    %20https://graph.microsoft.com/contacts.readwrite%20openid\
    &x-client-SKU=passport-azure-ad&x-client-Ver=3.0.9`
    this.loginWindows = undefined
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.importOutlook.SuccessfulLogin) {
      this.loginWindows.close()
    } else if (nextProps.importOutlook.done) {
      this.props.getContacts()
    }
  }
  render() {
    return <div />

    return (
      <button
        className="c-button--shadow contacts__toolbar__import"
        onClick={() => {
          this.loginWindows = window.open(
            this.url,
            'myWindow',
            'width=200,height=100'
          )
        }}
      >
        Import from Outlook
      </button>
    )
  }
}

export default connect(
  ({ contacts, user }) => ({
    importOutlook: contacts.importOutlook,
    user
  }),
  { getContacts }
)(ImportOutlook)
