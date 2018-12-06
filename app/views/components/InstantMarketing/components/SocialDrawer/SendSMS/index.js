import React from 'react'
import { connect } from 'react-redux'

import { addNotification as notify } from 'reapop'

import { parsePhoneNumber } from 'libphonenumber-js'

import { formatPhoneNumber } from 'utils/format'

import { shareInstance } from 'models/instant-marketing/instance-share'

import { Section } from '../Section'

class SendSMS extends React.Component {
  state = {
    isSending: false,
    isValidPhone: true,
    phone: formatPhoneNumber(this.props.user.phone_number)
  }

  handleChangePhone = e => {
    let isValidPhone = false
    const phone = e.target.value

    try {
      const phoneNumber = parsePhoneNumber(phone, 'US')

      isValidPhone = phoneNumber.isValid()
    } catch (e) {}

    this.setState({
      phone,
      isValidPhone
    })
  }

  handleSend = async () => {
    const phone = parsePhoneNumber(this.state.phone)

    this.setState({
      isSending: true
    })

    try {
      await shareInstance(
        this.props.instance.id,
        [phone.number],
        this.ShareText
      )

      this.props.notify({
        message: 'Image link sent to the phone number.',
        status: 'success'
      })
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({
        isSending: false
      })
    }
  }

  get ShareText() {
    const name = this.props.user.display_name

    return `${name} sent you this image! Tap on the link and press share on instagram or facebook`
  }

  render() {
    return (
      <Section
        title="Send via SMS:"
        buttonCaption={this.state.isSending ? 'Sending...' : 'Send'}
        buttonProps={{
          disabled: this.state.isSending || this.state.isValidPhone === false
        }}
        onButtonClick={this.handleSend}
        description="Send image to yourself and post to instagram and facebook directly from your phone."
      >
        <input value={this.state.phone} onChange={this.handleChangePhone} />
      </Section>
    )
  }
}

export default connect(
  null,
  { notify }
)(SendSMS)
