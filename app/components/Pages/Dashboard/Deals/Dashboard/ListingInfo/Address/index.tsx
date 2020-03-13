import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

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
import { getDealTitle } from 'deals/utils/get-deal-title'
import { getDealAddress } from 'deals/utils/get-deal-address'

import { upsertContexts } from 'actions/deals'
import { createUpsertObject } from 'models/Deal/helpers/dynamic-context'
import { normalizeAddress } from 'models/Deal/helpers/normalize-address'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

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
      width: '20rem'
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

  const cancleEdit = () => setIsEditingAddress(false)
  const editAddress = () => !props.deal.listing && setIsEditingAddress(true)

  const handleSave = async address => {
    const contexts = Object.entries(normalizeAddress(address)).reduce<
      {
        definition: any // TODO: needs typing for contact definitions
        checklist: IDealChecklist
        value: string | number
        approved: boolean
      }[]
    >((list, [name, value]) => {
      const context = createUpsertObject(props.deal, name, value, true)

      if (context) {
        list.push(context)
      }

      return list
    }, [])

    try {
      await dispatch(upsertContexts(props.deal.id, contexts))

      cancleEdit()
    } catch (e) {
      console.log(e)
    }
  }

  const title = getDealTitle(props.deal)
  const address = getDealAddress(props.deal)

  return (
    <>
      {isEditingAddress ? (
        <div className={classes.container}>
          <InlineAddressField
            address={getField(props.deal, 'full_address')}
            handleCancel={cancleEdit}
            handleSubmit={handleSave}
            style={{
              width: '20rem'
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

          <Button onClick={cancleEdit}>Cancel</Button>
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
            <Typography variant="subtitle1">{title}</Typography>

            {!props.deal.listing && (
              <Button
                color="secondary"
                size="small"
                className={classes.editButton}
              >
                {address.length ? 'Edit Address' : '+ Add Address'}
              </Button>
            )}
          </div>
        </Tooltip>
      )}
    </>
  )
}

export default Address
