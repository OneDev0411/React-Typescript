// Branch.js
import React, { Component } from 'react'
import config from '../../../config/public'
export default class Branch extends Component {
  componentDidMount() {
    const branch = require('branch-sdk')
    branch.init(config.branch.key, (err, data) => {
      window.location.href = '/password/create?token=' + data.data_parsed.token +
      '&email=' + encodeURIComponent(data.data_parsed.email) +
      '&phone_number=' + encodeURIComponent(data.data_parsed.phone_number) +
      '&room=' + encodeURIComponent(data.data_parsed.room) +
      '&listing=' + encodeURIComponent(data.data_parsed.listing) +
      '&alert=' + encodeURIComponent(data.data_parsed.alert) +
      '&action=' + encodeURIComponent(data.data_parsed.action) +
      '&new_email=true'
    })
  }
  render() {
    return <div/>
  }
}