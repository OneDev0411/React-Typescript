import S from 'shorti'
import React from 'react'
import { ApproveBtn, DeclineBtn } from './ReviewButtons'
import { Grid, Row, Col, Button } from 'react-bootstrap'

export default ({
  id,
  url,
  type,
  name,
  title,
  onClickApprove,
  onClickDecline
}) => (
  <Row
    key={`${type}_${id}`}
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
    <DeclineBtn onClick={onClickDecline} />
    <ApproveBtn onClick={onClickApprove} />
  </Row>
)