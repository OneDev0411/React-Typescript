// Branch.js
import React, { Component } from 'react'
import config from '../../../config/public'
export default class Branch extends Component {
  componentDidMount() {
    const branch = require('branch-sdk')
    branch.init(config.branch.key, (err, data) => {
      console.log('BRANCH DATA: ', err, data)
      let redirect = `/password/create?token=${data.data_parsed.token}`
      if (data.data_parsed.listing && data.data_parsed.listing !== 'undefined')
        redirect = `/dashboard/mls/${encodeURIComponent(data.data_parsed.listing)}?token=${data.data_parsed.token}`
      if (data.data_parsed.email)
        redirect += `&email=${encodeURIComponent(data.data_parsed.email)}`
      if (data.data_parsed.phone_number) {
        redirect += `&phone_number=${encodeURIComponent(data.data_parsed.phone_number)}`
        redirect += '&new_email=true'
      }
      if (data.data_parsed.room)
        redirect += `&room=${encodeURIComponent(data.data_parsed.room)}`
      if (data.data_parsed.listing && data.data_parsed.listing !== 'undefined')
        redirect += `&listing=${encodeURIComponent(data.data_parsed.listing)}`
      if (data.data_parsed.alert)
        redirect += `&alert=${encodeURIComponent(data.data_parsed.alert)}`
      if (data.data_parsed.action)
        redirect += `&action=${encodeURIComponent(data.data_parsed.action)}`
      if (data.data_parsed.receiving_user)
        redirect += `&receiving_user=${encodeURIComponent(data.data_parsed.receiving_user)}`
      window.location.href = redirect
    })
  }
  render() {
    return <div />
  }
}
