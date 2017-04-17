
import S from 'shorti'
import React from 'react'
import File from './ReviewItem'
import ListTitle from './ListTitle'
import { ApproveBtn, DeclineBtn } from './ReviewButtons'
import { Grid, Row, Col, Button } from 'react-bootstrap'

export default ({
  list,
  approveHandler,
  declineHandler
}) => (
  <div className="c-files">
    <ListTitle title={'Files'} />
    <div>
      <Grid
        className="table"
        style={S('p-0')}
      >
        {
          list.length > 0
            ? <div>
              <Row className="header">
                <Col xs={12}>TITLE</Col>
              </Row>
              {
              list.map(file => (
                <File
                  {...file}
                  type={'FILE'}
                  onClickApprove={approveHandler}
                  onClickDecline={declineHandler}
                />
              ))
            }
            </div>
            : <p style={{ fontSize: '18px' }}>No files have been posted yet.</p>
          }
      </Grid>
    </div>
  </div>
)