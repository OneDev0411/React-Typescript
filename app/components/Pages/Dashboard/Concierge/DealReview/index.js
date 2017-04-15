
import S from 'shorti'
import React from 'react'
import { browserHistory } from 'react-router'
import config from '../../../../../../config/public'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import ConciergeDispatcher from '../../../../../dispatcher/ConciergeDispatcher'

const styles = {
  title: {
    fontSize: '31px',
    fontWeight: 300,
    lineHeight: 1,
    color: '#5e676c'
  }
}

export default class DealReview extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      envelopes: [],
      submissions: [],
      envelopesLoading: true,
      submissionsLoading: true
    }
  }

  componentDidMount() {
    this.getAll()
  }

  async getAll() {
    let dealIndex = null
    const { user } = this.props
    const dealId = this.props.params.id
    const deals = this.props.conciergeDeals
    const deal = deals.find((deal, index) => {
      if (deal.id === dealId) {
        dealIndex = index
        return deal
      }
    })

    let { submissions } = deals[dealIndex]
    let { envelopes } = deals[dealIndex]

    if (submissions) {
      this.setState({
        submissions,
        submissionsLoading: false
      })
    } else
      await this.getSubmissions(user, dealId)

    if (envelopes) {
      this.setState({
        envelopes,
        envelopesLoading: false
      })
    } else
      await this.getEnvelopes(user, dealId)
  }

  async getSubmissions(user, dealId) {
    const submissions = await ConciergeDispatcher.dispatchSync({
      user,
      dealId,
      type: 'GET_SUBMISSIONS'
    })

    this.setState({
      submissions,
      submissionsLoading: false
    })
  }

  async getEnvelopes(user, dealId) {
    const envelopes = await ConciergeDispatcher.dispatchSync({
      user,
      dealId,
      type: 'GET_ENVELOPES'
    })

    this.setState({
      envelopes,
      envelopesLoading: false
    })
  }

  render() {
    const {
      envelopes,
      submissions,
      envelopesLoading,
      submissionsLoading
    } = this.state
    return (
      <div className="list">
        <div
          className="c-submissons"
          style={{
            marginBottom: '8rem'
          }}
        >
          <Row>
            <h2 style={styles.title}>Forms</h2>
          </Row>
          <Row>
            {
              <Grid
                className="table"
                style={{
                  padding: 0
                }}
              >
                <Row className="header">
                  <Col md={6} xs={10}>TITLE</Col>
                  <Col md={6} xs={2}>STATE</Col>
                </Row>
                {
                  submissionsLoading && <div>
                    <Row className="c-animated-background-placeholder" />
                    <Row className="c-animated-background-placeholder" />
                  </div>
                }
                <div
                  className={
                    submissionsLoading
                    ? 'u-fade'
                    : 'u-fade u-fade-out'
                  }
                >
                  {
                    submissions.length > 0 && submissions.map(submission => (
                      <Row
                        key={`DEAL_${submission.id}`}
                        onClick={() => browserHistory.push(`/dashboard/concierge/deals/${deal.id}/submission/${submission.id}`)}
                        className={'item'}
                        style={{
                          height: '48px',
                          padding: '16px 0'
                        }}
                      >
                        <Col md={6} xs={10}>
                          <span>{ submission.file.name }</span>
                        </Col>
                        <Col md={6} xs={2}>
                          <span>{ submission.state }</span>
                        </Col>
                      </Row>
                    ))
                  }
                </div>
              </Grid>
            }
          </Row>
        </div>
        <div className="c-envelopes">
          <Row>
            <h2 style={styles.title}>E-Sign</h2>
          </Row>
          <Row>
            {
              <Grid
                className="table"
                style={{
                  padding: 0
                }}
              >
                <Row className="header">
                  <Col xs={12}>TITLE</Col>
                </Row>
                {
                  envelopesLoading && <div>
                    <Row className="c-animated-background-placeholder" />
                    <Row className="c-animated-background-placeholder" />
                    <Row className="c-animated-background-placeholder" />
                  </div>
                }
                <div
                  className={
                    submissionsLoading
                    ? 'u-fade'
                    : 'u-fade u-fade-out'
                  }
                >
                  {
                    envelopes.length > 0 && envelopes.map(envelope => (
                      <Row
                        key={`DEAL_${envelope.id}`}
                        style={{ position: 'relative' }}
                        onClick={() => browserHistory.push(`/dashboard/concierge/deals/${deal.id}/envelope/${envelope.id}`)}
                        className={'item'}
                      >
                        <Col xs={9}>
                          <span
                            style={{
                              display: 'inline-block',
                              verticalAlign: 'middle',
                              lineHeight: '32px',
                              height: '32px'
                            }}
                          >{ envelope.proposed_title }</span>
                        </Col>
                        <Col xs={3} style={{ textAlign: 'right' }}>
                          <Button
                            style={{
                              width: '100px',
                              height: '32px',
                              borderRadius: '4px',
                              backgroundColor: '#f6f6f6',
                              color: '#5b6469',
                              lineHeight: 1,
                              borderWidth: 0,
                              display: 'inline-block',
                              marginRight: '1rem'
                            }}
                          >
                            <svg
                              style={{
                                display: 'inline-block',
                                verticalAlign: 'middle',
                                marginRight: '.5rem'
                              }}
                              fill="#5b6469" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                              <path d="M0 0h24v24H0z" fill="none"/>
                            </svg>
                            <span>Decline</span>
                          </Button>
                          <Button
                            bsStyle="primary"
                            style={{
                              width: '100px',
                              height: '32px',
                              borderRadius: '4px',
                              lineHeight: 1,
                              borderWidth: 0,
                              backgroundColor: '#2196f3'
                            }}
                          >
                            <svg
                              style={{
                                display: 'inline-block',
                                verticalAlign: 'middle',
                                marginRight: '.5rem'
                              }}
                              fill="#fff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 0h24v24H0z" fill="none"/>
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                            <span>Approve</span>
                          </Button>
                        </Col>
                      </Row>
                    ))
                  }
                </div>
              </Grid>
            }
          </Row>
        </div>
      </div>
    )
  }
}
