import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'

import { getField } from 'models/Deal/helpers/context/get-field'
import { getDealTitle } from 'deals/utils/get-deal-title'
import { getDealAddress } from 'deals/utils/get-deal-address'

import { upsertContexts } from 'actions/deals'
import { createUpsertObject } from 'models/Deal/helpers/dynamic-context'
import { normalizeAddress } from 'models/Deal/helpers/normalize-address'

import { H1 } from 'components/Typography/headings'
import Tooltip from 'components/tooltip'
import LinkButton from 'components/Button/LinkButton'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import { TitleContainer, AddressInput } from './styled'

function Address(props) {
  const [isEditingAddress, setIsEditingAddress] = useState(false)

  const cancleEdit = () => setIsEditingAddress(false)
  const editAddress = () => !props.deal.listing && setIsEditingAddress(true)

  const handleSave = async address => {
    const contexts = Object.entries(normalizeAddress(address)).reduce(
      (list, [name, value]) => {
        const context = createUpsertObject(props.deal, name, value, true)

        if (context) {
          list.push(context)
        }

        return list
      },
      []
    )

    try {
      await props.upsertContexts(props.deal.id, contexts)

      cancleEdit()
    } catch (e) {
      console.log(e)
    }
  }

  const title = getDealTitle(props.deal)
  const address = getDealAddress(props.deal)

  return (
    <Fragment>
      {isEditingAddress ? (
        <Fragment>
          <InlineAddressField
            address={getField(props.deal, 'full_address')}
            handleCancel={cancleEdit}
            handleSubmit={handleSave}
            style={{
              width: '20rem'
            }}
            renderSearchField={inputProps => (
              <AddressInput
                {...inputProps}
                placeholder="Search address..."
                type="text"
                autoFocus
              />
            )}
          />

          <LinkButton onClick={cancleEdit}>Cancel</LinkButton>
        </Fragment>
      ) : (
        <Tooltip
          captionIsHTML
          isCustom={false}
          caption={
            props.deal.listing && (
              <React.Fragment>
                <img src="/static/images/deals/lock.svg" alt="locked" />
                <div>
                  Listing information can only be changed on MLS. Once changed,
                  the update will be reflected here.
                </div>
              </React.Fragment>
            )
          }
          placement="bottom"
          multiline
        >
          <TitleContainer onClick={editAddress} editable={!props.deal.listing}>
            <H1 style={{ lineHeight: 1.5 }}>{title}</H1>

            <span>{address.length ? 'Edit Address' : '+ Add Address'}</span>
          </TitleContainer>
        </Tooltip>
      )}
    </Fragment>
  )
}

export default connect(
  null,
  { upsertContexts }
)(Address)
