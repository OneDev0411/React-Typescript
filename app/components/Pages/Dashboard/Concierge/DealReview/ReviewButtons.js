import React from 'react'
import { Button } from 'react-bootstrap'

export const DeclineBtn = ({
  onClick
}) => (
  <Button
    className="c-concierge__btn--decline"
    onClick={onClick}
  >
    <svg fill="#5b6469" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
    <span>Decline</span>
  </Button>
)

export const ApproveBtn = ({
  onClick
}) => (
  <Button
    bsStyle="primary"
    className="c-concierge__btn--approve"
    onClick={onClick}
  >
    <svg fill="#fff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none" /><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
    <span>Approve</span>
  </Button>
)