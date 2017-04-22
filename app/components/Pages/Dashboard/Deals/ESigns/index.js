import React from 'react'
import { Grid, Container, Row, Col, Tabs, Tab, Button } from 'react-bootstrap'
import _ from 'underscore'
import cn from 'classnames'
import Avatar from 'react-avatar'
import S from 'shorti'
import moment from 'moment'
import tz from 'moment-timezone'
import Deal from '../../../../../models/Deal'
import config from '../../../../../../config/public'

export default class DealESigns extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      envelope: null,
      docsResent: false,
      resendingDoc: false,
      docLastResent: null
    }
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    const { envelopes } = nextProps

    if (!this.state.envelope && envelopes && _.size(envelopes) > 0) {
      this.setState({
        envelope: envelopes[Object.keys(envelopes)[0]]
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.activeTab === 'esigns'
  }

  displayEnvelope(envelope) {
    this.setState({
      envelope,
      docsResent: false,
      resendingDoc: false
    })
  }

  displayEnvelopeDocument(id, index) {
    const { user } = this.props
    const token = user.access_token
    const base_url = `${config.app.url}/api/deals/envelope/preview`
    const url = `${base_url}?id=${id}&index=${index}&access_token=${token}`
    return url
  }

  getSignLink(eid) {
    const { user } = this.props
    const token = user.access_token
    return `${config.app.url}/api/deals/envelope/${eid}/sign?access_token=${token}`
  }

  async resendDocs(eid) {
    const { user } = this.props
    const token = user.access_token

    this.setState({ resendingDoc: true })

    // resending docs
    try {
      await Deal.resendEnvelopeDocs(eid, token)
      this.setState({
        docsResent: true,
        resendingDoc: false,
        docLastResent: moment().unix()
      })
    } catch (e) {
      this.setState({
        docsResent: false,
        resendingDoc: false
      })
    }
  }

  render() {
    const { envelopes, user } = this.props
    const { envelope, resendingDoc, docsResent, docLastResent } = this.state

    if (!envelopes) {
      return (
        <div className="loading center">
          <i className="fa fa-spinner fa-spin fa-2x fa-fw" />
        </div>
      )
    }

    if (_.size(envelopes) === 0) {
      return (
        <div className="no-esign">
          You haven't sent any docs yet
        </div>
      )
    }

    const signed_users = _.filter(envelope.recipients, recp => recp.signed_at !== null)
    const not_signed_users = _.filter(envelope.recipients, recp => recp.signed_at === null)

    return (
      <Row>
        <Col xs={5} sm={5} style={S('p-0')}>
          {
            envelopes && _.map(envelopes, evlp => {
              const _signed_users = _.filter(evlp.recipients, recp => recp.signed_at !== null)

              return (
                <div
                  key={`envelope${evlp.id}`}
                  className={cn('esign-detail', { active: evlp.id === envelope.id })}
                  onClick={this.displayEnvelope.bind(this, evlp)}
                >
                  <Row>
                    <Col xs={2}>
                      <img src="/static/images/deals/esign.png" />
                    </Col>
                    <Col xs={10}>
                      <div className="title">{ evlp.title }</div>
                      <div className="info">
                        { evlp.documents ? evlp.documents.length : 0 } docs | &nbsp;
                        { _signed_users.length } of &nbsp;
                        { evlp.recipients.length } signed
                      </div>
                    </Col>
                  </Row>
                </div>
              )
            })
          }
        </Col>

        <Col
          xs={7}
          sm={7}
          className="detail"
          style={{
            minHeight: `${_.size(envelopes) * 14}vh`
          }}
        >
          <h3>{ envelope.title }</h3>

          {
            envelope.documents &&
            <div>
              <div className="hr" />
              {
                envelope.documents.map((doc, key) => (
                  <div key={`env_doc_${doc.id}`} className="documents">
                    <img src="/static/images/deals/file.png" style={S('w-16 mr-10')} />
                    <a target="_blank" href={this.displayEnvelopeDocument(envelope.id, key)}>
                      { doc.title }
                    </a>
                  </div>
                  ))
              }

              <div className="hr" />
            </div>
          }

          {
            signed_users && signed_users.length > 0 &&
            <div>
              <div style={S('mt-50')}>SIGNED BY</div>
              <div className="hr" />
              {
                signed_users.map(recp => (
                  <Row key={`env_recp_s_${recp.id}`} style={S('mb-10')}>
                    <Col xs={2}>
                      <Avatar
                        round
                        name={recp.user.display_name}
                        src={recp.user.profile_image_url}
                        size={30}
                      />
                    </Col>

                    <Col xs={10}>
                      <div>{ recp.user.display_name }</div>
                      <div className="signed_at">
                        { moment(recp.signed_at).format('Y/MM/D, HH:mm') }
                      </div>
                    </Col>
                  </Row>
                  ))
              }
            </div>
          }

          {
            not_signed_users.length > 0 &&
            <div>
              <Row className="not-signed">
                <Col xs={5}>HAS NOT SIGNED</Col>
                <Col xs={7} className="resend">
                  <Button
                    bsStyle="primary"
                    bsSize="small"
                    disabled={resendingDoc || docsResent}
                    onClick={this.resendDocs.bind(this, envelope.id)}
                  >
                    { resendingDoc && 'Sending' }
                    { docsResent && 'Docs sent' }
                    { !resendingDoc && !docsResent && 'Resend Docs' }
                  </Button>
                </Col>
              </Row>

              <div className="hr" />
              <div className="not-signed-list">
                {
                  not_signed_users.map(recp => (
                    <Row key={`env_recp_ns_${recp.id}`} style={S('mb-10')}>
                      <Col xs={2}>
                        <Avatar
                          style={S('op-0.3')}
                          round
                          name={recp.user.display_name}
                          src={recp.user.profile_image_url}
                          size={30}
                        />
                      </Col>

                      <Col xs={6}>
                        <div style={S('op-0.3')}>
                          { recp.user.display_name }
                        </div>
                        <div style={S('op-0.3 font-11')}>
                            Doc sent {
                              moment
                                .unix(docLastResent || recp.created_at)
                                .tz(user.timezone)
                                .format('Y/MM/D, HH:mm')
                            }
                        </div>
                      </Col>

                      <Col xs={4}>
                        {
                            this.props.user.id === recp.user.id &&
                            <a
                              href={this.getSignLink(envelope.id)}
                              target="_blank"
                            >
                              Sign now
                            </a>
                          }
                      </Col>
                    </Row>
                    ))
                }
              </div>
            </div>
          }
        </Col>
      </Row>
    )
  }
}
