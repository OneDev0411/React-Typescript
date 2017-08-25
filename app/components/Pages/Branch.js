// Branch.js
import branch from 'branch-sdk'
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import config from '../../../config/public'

const branchKey = config.branch.key

export default class Branch extends Component {
  componentDidMount() {
    branch.init(branchKey, (err, { data_parsed }) => {
      if (err) {
        browserHistory.push('/oops')
      }

      Object.keys(data_parsed).forEach(key => {
        data_parsed[key] = encodeURIComponent(data_parsed[key])
      })

      const {
        room,
        token,
        alert,
        email,
        action,
        listing,
        phone_number,
        receiving_user
      } = data_parsed

      let redirect = `/register?token=${token}`

      if (listing) {
        redirect = `/dashboard/mls/${listing}?token=${token}`
      }

      if (email) {
        redirect += `&email=${email}`
      }

      if (phone_number) {
        redirect += `&phone_number=${phone_number}`
        redirect += '&new_email=true'
      }

      if (room) {
        redirect += `&room=${room}`
      }

      if (listing) {
        redirect += `&listing=${listing}`
      }

      if (alert) {
        redirect += `&alert=${alert}`
      }

      if (action) {
        redirect += `&action=${action}`
      }

      if (receiving_user) {
        redirect += `&receiving_user=${receiving_user}`
      }

      browserHistory.push(redirect)
    })
  }

  render() {
    return <div />
  }
}
