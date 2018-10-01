import React from 'react'
import ListingStatus from './listing-status'
import ActionButton from 'components/Button/ActionButton'
import IconButton from 'components/Button/IconButton'
import { primary } from 'views/utils/colors'

const EditButton = ActionButton.extend`
  display: none;
`

const DeleteButton = IconButton.extend`
  display: none;
  color: #a4a4a4;
  &:hover {
    color: ${primary};
  }
`

class Info extends React.Component {
  render() {
    const { deal, editMls, deleteMls } = this.props
    const hasListing = deal && deal.mls_context

    return (
      <div className="mls-info">
        {!deal.is_draft && <ListingStatus deal={deal} />}

        <div className="item">
          <div className="lbl">MLS#:</div>
          <div className="value mls-number">
            {(hasListing && deal.mls_context.mls_number) || '-'}

            <EditButton
              size="small"
              appearance="link"
              className="deals-info__edit-cta"
              onClick={editMls}
            >
              EDIT
            </EditButton>

            {hasListing && (
              <DeleteButton
                size="small"
                onClick={deleteMls}
                className="deals-info__close-icon"
              >
                <i className="fa fa-times-circle" />
              </DeleteButton>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Info
