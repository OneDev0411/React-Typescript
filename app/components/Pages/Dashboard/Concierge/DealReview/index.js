
import S from 'shorti'
import React from 'react'
import Modal from './Modal'
import { browserHistory, Link } from 'react-router'
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

const getFieldValue = (deal, field) => {
  if (deal.context && deal.context[field])
    return deal.context[field]
  else if (deal.proposed_values && deal.proposed_values[field])
    return deal.proposed_values[field]

  return '-'
}

export default class DealReview extends React.Component {

  constructor(props) {
    super(props)
    this.deal = null
    this.dealIndex = null

    this.state = {
      files: [],
      envelopes: [],
      submissions: [],
      envelopesLoading: true,
      submissionsLoading: true,
      modalType: '',
      modalTitle: '',
      modalActive: false
    }

    this.modalCloseHandler = this.modalCloseHandler.bind(this)
    this.modalSubmitHandler = this.modalSubmitHandler.bind(this)
  }

  componentDidMount() {
    this.findDeal()
    this.getAll()
  }

  findDeal() {
    const dealId = this.props.params.id
    const deals = this.props.conciergeDeals
    this.deal = deals.find((deal, index) => {
      if (deal.id === dealId) {
        this.dealIndex = index
        return deal
      }
    })
    this.setState({
      files: this.deal.files || []
    })
  }

  async getAll() {
    const { user } = this.props
    const dealId = this.props.params.id
    const deals = this.props.conciergeDeals

    let { submissions } = deals[this.dealIndex]
    let { envelopes } = deals[this.dealIndex]

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
    const action = {
      user,
      dealId,
      type: 'GET_SUBMISSIONS'
    }
    const submissions =
      await ConciergeDispatcher.dispatchSync(action)
    this.setState({
      submissions,
      submissionsLoading: false
    })
  }

  async getEnvelopes(user, dealId) {
    const action = {
      user,
      dealId,
      type: 'GET_ENVELOPES'
    }
    const envelopes =
      await ConciergeDispatcher.dispatchSync(action)


    debugger

    this.setState({
      envelopes,
      envelopesLoading: false
    })
  }

  modalSubmitHandler(type) {
    switch (type) {
      case 'APPROVE':
        this.approveDocuments()
        break
      case 'DECLINE':
        this.declineDocuments()
        break
      default:
        this.setState({
          modalActive: false
        })
    }
  }

  approveDocuments() {

  }

  declineDocuments() {

  }

  modalCloseHandler() {
    this.setState({ modalActive: false })
  }

  render() {
    const {
      files,
      envelopes,
      submissions,
      envelopesLoading,
      submissionsLoading
    } = this.state
    return (
      <div className="list">
        <div
          className="c-submissons"
          style={{ marginBottom: '4rem' }}
        >
          <Row>
            <Col xs={12}><h2 style={styles.title}>Forms</h2></Col>
          </Row>
          <div>
            {
              <Grid
                className="table"
                style={{
                  padding: 0
                }}
              >
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
                    submissions.length > 0
                      ? <div>
                        <Row
                          className="header"
                          style={{
                            marginTop: '10px',
                            marginBottom: 0
                          }}
                        >
                          <Col md={6} xs={10}>TITLE</Col>
                          <Col md={6} xs={2}>STATE</Col>
                        </Row>
                        {
                          submissions.map(submission => (
                            <a
                              key={`DEAL_${submission.id}`}
                              href={submission.file.url}
                              target="_blank"
                              className={'item row'}
                              style={{
                                display: 'block',
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
                            </a>
                          ))
                        }
                      </div>
                      : <p style={{ fontSize: '18px' }}>No forms have been posted yet.</p>
                  }
                </div>
              </Grid>
            }
          </div>
        </div>
        <div className="c-envelopes">
          <Row>
            <Col xs={12}><h2 style={styles.title}>E-Sign</h2></Col>
          </Row>
          {
            envelopesLoading && <div>
              <div className="c-animated-background-placeholder" />
              <div className="c-animated-background-placeholder" />
            </div>
          }
          <div
            className={
              envelopesLoading
              ? 'u-fade'
              : 'u-fade u-fade-out'
            }
          >
            {
              envelopes.length > 0
                ? envelopes.map(envelope => (
                  envelope.documents && <Grid
                    key={`ENVELOPE_${envelope.id}`}
                    className="table"
                    style={{
                      padding: 0
                    }}
                  >
                    <Row>
                      <Col xs={12}>
                        <p
                          style={{
                            fontSize: '17px',
                            fontWeight: 300,
                            color: '#5e676c',
                            marginTop: '2rem'
                          }}
                        >
                          {envelope.title}
                        </p>
                      </Col>
                    </Row>
                    <Row
                      className="header"
                      style={{
                        marginTop: '10px',
                        marginBottom: 0
                      }}
                    >
                      <Col xs={12}>TITLE</Col>
                    </Row>
                    {
                      envelope.documents.map(document => (
                        <Row
                          key={`DEAL_${document.id}`}
                          className={'item'}
                          style={{ position: 'relative' }}
                        >
                          <Col
                            xs={12}
                            style={{
                              height: '32px',
                              paddingTop: '8px'
                            }}
                          >
                            {document.title}
                          </Col>
                          <a
                            href="#"
                            target="_blank"
                            style={{
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              left: 0,
                              bottom: 0
                            }}
                          />
                          <Button
                            onClick={
                              () => this.setState({
                                modalActive: true,
                                modalType: 'DECLINE',
                                modalTitle: 'Why has this document been declined?'
                              })
                            }
                            style={{
                              width: '100px',
                              height: '32px',
                              position: 'absolute',
                              right: '115px',
                              zIndex: 2,
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
                              fill="#5b6469" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                              <path d="M0 0h24v24H0z" fill="none" />
                            </svg>
                            <span>Decline</span>
                          </Button>
                          <Button
                            bsStyle="primary"
                            style={{
                              width: '100px',
                              height: '32px',
                              position: 'absolute',
                              right: '15px',
                              zIndex: 2,
                              borderRadius: '4px',
                              lineHeight: 1,
                              borderWidth: 0,
                              backgroundColor: '#2196f3'
                            }}
                            onClick={
                              () => this.setState({
                                modalActive: true,
                                modalType: 'APPROVE',
                                modalTitle: 'Hurrah! Smooth sailing.'
                              })
                            }
                          >
                            <svg
                              style={{
                                display: 'inline-block',
                                verticalAlign: 'middle',
                                marginRight: '.5rem'
                              }}
                              fill="#fff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M0 0h24v24H0z" fill="none" />
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            <span>Approve</span>
                          </Button>
                        </Row>
                      ))
                    }
                  </Grid>
                ))
                : <p style={{ fontSize: '18px' }}>No envelopes have been posted yet.</p>
            }
          </div>
        </div>
        <div
          className="c-files"
          style={{ marginBottom: '4rem', marginTop: '4rem' }}
        >
          <Row>
            <Col xs={12}><h2 style={styles.title}>Files</h2></Col>
          </Row>
          <div>
            <Grid
              className="table"
              style={{
                padding: 0
              }}
            >
              {
                files.length > 0
                  ? <div>
                    <Row
                      className="header"
                      style={{
                        marginTop: '10px',
                        marginBottom: 0
                      }}
                    >
                      <Col xs={12}>TITLE</Col>
                    </Row>
                    {
                    files.map(file => (
                      <Row
                        key={`DEAL_Files_${file.id}`}
                        className={'item'}
                        style={{ position: 'relative' }}
                      >
                        <Col
                          xs={12}
                          style={{
                            height: '32px',
                            paddingTop: '8px'
                          }}
                        >
                          {file.name}
                        </Col>
                        <a
                          href="#"
                          target="_blank"
                          style={{
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0
                          }}
                        />
                        <Button
                          onClick={
                            () => this.setState({
                              modalActive: true,
                              modalType: 'DECLINE',
                              modalTitle: 'Why has this document been declined?'
                            })
                          }
                          style={{
                            width: '100px',
                            height: '32px',
                            position: 'absolute',
                            right: '115px',
                            zIndex: 2,
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
                            fill="#5b6469" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            <path d="M0 0h24v24H0z" fill="none" />
                          </svg>
                          <span>Decline</span>
                        </Button>
                        <Button
                          bsStyle="primary"
                          style={{
                            width: '100px',
                            height: '32px',
                            position: 'absolute',
                            right: '15px',
                            zIndex: 2,
                            borderRadius: '4px',
                            lineHeight: 1,
                            borderWidth: 0,
                            backgroundColor: '#2196f3'
                          }}
                          onClick={
                            () => this.setState({
                              modalActive: true,
                              modalType: 'APPROVE',
                              modalTitle: 'Hurrah! Smooth sailing.'
                            })
                          }
                        >
                          <svg
                            style={{
                              display: 'inline-block',
                              verticalAlign: 'middle',
                              marginRight: '.5rem'
                            }}
                            fill="#fff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                          <span>Approve</span>
                        </Button>
                      </Row>
                    ))
                  }
                  </div>
                  : <p style={{ fontSize: '18px' }}>No files have been posted yet.</p>
                }
            </Grid>
          </div>
        </div>
        <Modal
          title={this.state.modalTitle}
          isActive={this.state.modalActive}
          onCloseHandler={this.modalCloseHandler}
          onSubmitHandler={this.modalSubmitHandler}
        />
      </div>
    )
  }
}
