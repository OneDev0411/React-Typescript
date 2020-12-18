import React from 'react'
import { connect } from 'react-redux'

import { addNotification as notify } from 'components/notification'

import { isValidPhoneNumber } from 'utils/helpers'

import { formatPhoneNumber } from 'utils/format'
import { shareInstance } from 'models/instant-marketing/instance-share'

import { Section } from '../components/Section'

class SendSMS extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSending: false,
      isValidPhone: null,
      phone: formatPhoneNumber(this.props.user.phone_number)
    }
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    const { phone_number } = this.props.user
    const isValidPhone = phone_number
      ? await isValidPhoneNumber(phone_number)
      : false

    this.setState({ isValidPhone })
  }

  handleChangePhone = async e => {
    const phone = e.target.value

    const isValidPhone = await isValidPhoneNumber(phone)

    this.setState({
      phone,
      isValidPhone
    })
  }

  handleSend = async () => {
    const { phone } = this.state

    this.setState({
      isSending: true
    })

    try {
      console.log(`Sending SMS to ${phone}`)

      await shareInstance(this.props.instance.id, [phone], this.ShareText)

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
        description="Send image to yourself and post to Instagram and Facebook directly from your phone."
        styles={{
          info: {
            padding: 0
          }
        }}
      >
        <input
          value={this.state.phone}
          onChange={this.handleChangePhone}
          placeholder="Add phone number"
        />
      </Section>
    )
  }
}

export default connect(null, { notify })(SendSMS)
