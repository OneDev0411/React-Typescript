
import S from 'shorti'
import React from 'react'
import ListTitle from './ListTitle'
import Document from './ReviewItem'
import { ApproveBtn, DeclineBtn } from './ReviewButtons'
import { Grid, Row, Col, Button } from 'react-bootstrap'

export default ({
  list,
  loading,
  approveHandler,
  declineHandler
}) => (
  <div className="c-envelopes">
    <ListTitle title={'E-Sign'} />
    {
      loading && <div>
        <div className="c-animated-background-placeholder" />
        <div className="c-animated-background-placeholder" />
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
        list.length > 0
          ? list.map(item => (
            item.documents
              ? <Grid
                key={`ENVELOPE_${item.id}`}
                className="table"
                style={S('p-0')}
              >
                <Row>
                  <Col xs={12}>
                    <p className="c-concierge__sublist-title">
                      {item.title}
                    </p>
                  </Col>
                </Row>
                <Row className="header">
                  <Col xs={12}>TITLE</Col>
                </Row>
                {
                  item.documents.map(document => (
                    <Document
                      {...document}
                      type={'DOCUMENT'}
                      onClickApprove={approveHandler}
                      onClickDecline={declineHandler}
                    />
                  ))
                }
              </Grid>
              : <p style={S('font-18')}>No list have been posted yet.</p>
          ))
          : <p style={S('font-18')}>No list have been posted yet.</p>
      }
    </div>
  </div>
)