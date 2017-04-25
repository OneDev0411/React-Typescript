import S from 'shorti'
import React from 'react'
import { ApproveBtn, DeclineBtn } from './ReviewButtons'
import { Grid, Row, Col, Button } from 'react-bootstrap'



export default ({
  id,
  url,
  name,
  title,
  review,
  onClickApprove,
  onClickDecline
}) => {
  const reviewId = review ? review.id : null
  const getReviewState = (state = 'Pending') => {
    switch (state) {
      case 'Approved':
        return <span className="review-state--ok">APPROVED</span>
      case 'Rejected':
        return <span className="review-state--reject">DECLINED</span>
      default:
        return (<div>
          <DeclineBtn onClick={() => onClickDecline(reviewId)} />
          <ApproveBtn onClick={() => onClickApprove(reviewId)} />
        </div>)
    }
  }
  return (
    <Row
      className={'item'}
      style={S('relative')}
    >
      <Col
        xs={12}
        style={S('h-32 pt-8')}
      >
        {title || name}
      </Col>
      <a
        className="c-concierge__item-link"
        href={url}
        target="_blank"
      />
      <div
        style={{
          position: 'absolute',
          right: '15px',
          zIndex: '2',
          width: '210px',
          height: '32px',
          textAlign: 'right'
        }}
      >
        { review && getReviewState(review.state) }
      </div>
    </Row>
  )
}