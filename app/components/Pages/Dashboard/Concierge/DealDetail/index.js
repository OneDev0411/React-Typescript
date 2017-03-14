import React, { Component } from 'react'
import S from 'shorti'
import cookie from 'react-cookie'
import moment from 'moment'
import _ from 'underscore'
import AppStore from '../../../../../stores/AppStore'
import ConciergeDispatcher from '../../../../../dispatcher/ConciergeDispatcher'
import SideBar from '../../Partials/SideBar'
import MobileNav from '../../Partials/MobileNav'
import config from '../../../../../../config/public'

export default class Deals extends Component {

  constructor(props) {
    super(props)
    const deals = AppStore.data.concierge_deals
    const deal_index = _.findIndex(deals, d => d.id === props.params.id)
    const deal = deals[deal_index]

    this.state = {
      deal
    }
  }

  componentDidMount() {
    const { deal } = this.state
    const cookies = deal.cookies

    _.each(cookies, (value, key) => {
      cookie.save(key, value, {
        path: '/',
        domain: '.rechat.com',
        expires: new Date('Fri Aug 02 2020 00:00:00')
      })
    })

    this.getSubmissions()
    this.getEnvelopes()
  }

  getPreview(file) {
    return (
      <img
        src={ file.preview_url }
        className="preview-file"
      />
    )
  }

  getEnvelopes() {
    const { user } = AppStore.data

    ConciergeDispatcher.dispatch({
      action: 'get-envelopes',
      user,
      deal_id: this.props.params.id
    })
  }

  getSubmissions() {
    const { user } = AppStore.data

    ConciergeDispatcher.dispatch({
      action: 'get-submissions',
      user,
      deal_id: this.props.params.id
    })
  }

  loadEnvelopeForm(id, index) {
    const { data } = this.props
    const token = data.user.access_token
    const base_url = `${config.app.url}/api/deals/envelope/preview`
    const url = `${base_url}?id=${id}&index=${index}&access_token=${token}`
    return url
  }

  loadSubmissionForm(id) {
    const { data } = this.props
    const token = data.user.access_token
    const url = `${config.forms.url}/submissions/${id}.pdf?token=${token}&flat=1`
    return url
  }

  render() {
    const { data } = this.props
    const user = data.user

    let main_style = S('absolute l-70 r-0')
    let nav_area = <SideBar data={ data } />

    if (data.is_mobile) {
      main_style = { ...main_style, ...S('l-0 w-100p') }

      if (user)
        nav_area = <MobileNav data={ data } />
    }

    const { deal } = this.state

    return (
      <div style={ S('minw-1000') }>
        <main>
          { nav_area }
          <div className="deals" style={ main_style }>

            {
              deal.files && deal.files.length > 0 &&
              <div>
                <h3 className="section-title">Files</h3>
                <table>
                  <thead>
                    <tr>
                      <td>NAME</td>
                      <td>TYPE</td>
                      <td>MIME</td>
                      <td>DATE CREATED</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      deal.files.map(file => {
                        return (
                          <tr key={`FILE_${file.id}`}>
                            <td>
                              { this.getPreview(file) }
                              { file.name }
                            </td>
                            <td>{ file.type }</td>
                            <td>{ file.mime }</td>
                            <td>{ moment(file.created_at * 1000).format('Y/M/D HH:mm') }</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            }

            {
              deal.submissions && deal.submissions.length > 0 &&
              <div>
                <h3 className="section-title">Forms</h3>
                <table>
                  <thead>
                    <tr>
                      <td>TITLE</td>
                      <td>STATE</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      deal.submissions.map(submission => {
                        return (
                          <tr key={`SUBMISSIONS_${submission.id}`}>
                            <td>
                              <a target="_blank" href={this.loadSubmissionForm(submission.last_revision)}>
                                { submission.title }
                              </a>
                            </td>
                            <td>{ submission.state }</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            }

            {
              deal.envelopes && deal.envelopes.length > 0 &&
              <div>
                <h3 className="section-title">E-Signs</h3>
                {
                  deal.envelopes.map(envelope => {
                    return (
                      <div key={`ENVELOP_${envelope.id}`}>
                        <b>
                          { envelope.title }
                        </b>

                        <table>
                          <thead>
                            <tr>
                              <td>TITLE</td>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              envelope.documents.map((edoc, key) => {
                                return (
                                  <tr key={`ENVELOPE_DOC_${edoc.id}`}>
                                    <td>
                                      <a target="_blank" href={this.loadEnvelopeForm(envelope.id, key)}>
                                        { edoc.title }
                                      </a>
                                    </td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                    )
                  })
                }
              </div>
            }

          </div>
        </main>
      </div>
    )
  }
}

Deals.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object
}
