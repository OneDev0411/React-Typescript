// Branch.js
import React, { Component } from 'react'
import config from '../../../config/public'
export default class Branch extends Component {
  componentDidMount() {
    const branch = require('branch-sdk')
    branch.init(config.branch.key, (err, data) => {
      window.location.href = '/password/create?token=' + data.data_parsed.token + '&email=' + encodeURIComponent(data.data_parsed.email) + '&new_email=true'
    })
  }
  render() {
    return <div/>
  }
}