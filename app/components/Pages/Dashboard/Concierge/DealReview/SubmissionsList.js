import React from 'react'
import ListTitle from './ListTitle'
import { Grid, Row, Col } from 'react-bootstrap'

const Item = ({
  id,
  file,
  state
}) => (
  <a
    key={`DEAL_${id}`}
    href={file.url}
    target="_blank"
    className={'item row'}
    style={{
      display: 'block',
      height: '48px',
      padding: '16px 0'
    }}
  >
    <Col md={6} xs={10}>
      <span>{ file.name }</span>
    </Col>
    <Col md={6} xs={2}>
      <span>{ state }</span>
    </Col>
  </a>
)

export default ({
  loading,
  submissions
}) => (
  <div className="c-submissons">
    <ListTitle title={'Forms'} />
    <Grid
      className="table"
      style={{
        padding: 0
      }}
    >
      {
        loading && <div>
          <Row className="c-animated-background-placeholder" />
          <Row className="c-animated-background-placeholder" />
        </div>
      }
      <div
        className={
          loading
          ? 'u-fade'
          : 'u-fade u-fade-out'
        }
      >
        {
          submissions.length > 0
            ? <div>
              <Row className="header">
                <Col md={6} xs={10}>TITLE</Col>
                <Col md={6} xs={2}>STATE</Col>
              </Row>
              {
                submissions.map(submission => (
                  <Item {...submission} />
                ))
              }
            </div>
            : <p style={{ fontSize: '18px' }}>No forms have been posted yet.</p>
        }
      </div>
    </Grid>
  </div>
)