import React from 'react'
import { Popover, OverlayTrigger } from 'react-bootstrap'

const popover = {
  submitReview: <Popover
    className="c-popover c-popover--bottom"
    id="popover-submitReview"
  >
    Submit for broker review
  </Popover>,

  collectSignatures: <Popover
    className="c-popover c-popover--bottom"
    id="popover-collectSignatures"
  >
    Collect Signatures
  </Popover>
}

export default ({
  submissions,
  onCollectSignatures,
  onReviewRequest
}) => (
  <ul className="menu">
    {
      submissions &&
      <OverlayTrigger
        placement="bottom"
        overlay={popover.collectSignatures}
        delayShow={200}
        delayHide={0}
      >
        <li
          onClick={() => onCollectSignatures()}
        >
          <img src="/static/images/deals/pen.svg" />
        </li>
      </OverlayTrigger>
    }
    <OverlayTrigger
      placement="bottom"
      overlay={popover.submitReview}
      delayShow={200}
      delayHide={0}
    >
      <li
        onClick={() => onReviewRequest()}
      >
        <img src="/static/images/deals/glasses-round.svg" />
      </li>
    </OverlayTrigger>
  </ul>
)
