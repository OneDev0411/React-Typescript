
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
                        onClick={() => browserHistory.push(`/dashboard/concierge/deals/${deal.id}/envelope/${envelope.id}`)}
                        className={'item'}
                      >
                        <Col xs={12}>
                          <span>{ envelope.proposed_title }</span>
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
