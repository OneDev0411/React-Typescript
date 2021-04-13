import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  TextField,
  Button,
  Tooltip,
  Typography,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'

import { getField } from 'models/Deal/helpers/context/get-field'
import { createAddressContext } from 'deals/utils/create-address-context'

import { upsertContexts } from 'actions/deals'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'
import { getDealChecklists } from 'reducers/deals/checklists'
import { IAppState } from 'reducers'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center'
    },
    editButton: {
      marginLeft: theme.spacing(1)
    },
    addressInput: {
      width: '18rem'
    },
    addressSecondary: {
      color: theme.palette.grey[500]
    }
  })
)

interface Props {
  deal: IDeal
}

export function Address(props: Props) {
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const classes = useStyles()
  const dispatch = useDispatch()

  const checklists = useSelector<IAppState, IDealChecklist[]>(state =>
    getDealChecklists(props.deal, state.deals.checklists)
  )

  const cancelEdit = () => setIsEditingAddress(false)
  const editAddress = () => !props.deal.listing && setIsEditingAddress(true)
  const fullAddress = getField(props.deal, 'full_address')
  const addressTitle = (fullAddress || props.deal.title).split(',')

  const handleSave = async address => {
    const contexts = createAddressContext(props.deal, checklists, address)

    try {
      await dispatch(upsertContexts(props.deal.id, contexts))

      cancelEdit()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      {isEditingAddress ? (
        <div className={classes.container}>
          <InlineAddressField
            address={fullAddress}
            handleCancel={cancelEdit}
            handleSubmit={handleSave}
            style={{
              width: '18rem'
            }}
            renderSearchField={inputProps => (
              <TextField
                {...inputProps}
                className={classes.addressInput}
                color="secondary"
                placeholder="Search address..."
                type="text"
                autoFocus
              />
            )}
          />

          <Button onClick={cancelEdit}>Cancel</Button>
        </div>
      ) : (
        <Tooltip
          title={
            props.deal.listing ? (
              <div>
                Listing information can only be changed on MLS. Once changed,
                the update will be reflected here.
              </div>
            ) : (
              ''
            )
          }
          placement="bottom"
        >
          <div className={classes.container} onClick={editAddress}>
            <div>
              <Typography variant="subtitle1">{addressTitle[0]}</Typography>

              {addressTitle.length > 1 && (
                <Typography
                  variant="subtitle2"
                  className={classes.addressSecondary}
                >
                  {addressTitle.slice(1, addressTitle.length - 1).join(', ')}
                </Typography>
              )}
            </div>

            {!props.deal.listing && (
              <Button
                color="secondary"
                size="small"
                className={classes.editButton}
              >
                {fullAddress ? 'Edit' : '+ Add Address'}
              </Button>
            )}
          </div>
        </Tooltip>
      )}
    </>
  )
}

export default Address
