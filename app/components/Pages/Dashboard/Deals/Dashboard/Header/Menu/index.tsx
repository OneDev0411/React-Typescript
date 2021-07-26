import React from 'react'

import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { withRouter, WithRouterProps } from 'react-router'

import { CloseButton } from 'components/Button/CloseButton'
import OpenHouse from 'deals/components/OpenHouse'
import YardSign from 'deals/components/YardSign'

import DealStatus from '../../../components/DealStatus'

import { Email } from './Email'
import RemoveDraft from './RemoveDraft'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      '& button': {
        color: theme.palette.common.black,
        fontWeight: 'bold',
        borderColor: `${theme.palette.divider} !important`, // important fixes safari
        marginLeft: theme.spacing(1)
      }
    }
  })
)

export const Menu = withRouter(
  ({ deal, isBackOffice, router, location }: Props & WithRouterProps) => {
    const theme = useTheme<Theme>()
    const classes = useStyles()

    return (
      <div className={classes.container}>
        {deal.is_draft === true && <RemoveDraft deal={deal} />}

        {deal.deal_type === 'Selling' && (
          <OpenHouse
            deal={deal}
            defaultOpen={(location.state || {}).autoBookOpenHouse}
          />
        )}

        <YardSign deal={deal} />

        <Email />

        {deal.deal_type === 'Selling' && !deal.has_active_offer && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => router.push(`/dashboard/deals/${deal.id}/offer`)}
          >
            Add Offer
          </Button>
        )}

        <DealStatus deal={deal} isBackOffice={isBackOffice} />

        <CloseButton
          buttonProps={{
            size: 'small'
          }}
          iconProps={{
            color: theme.palette.grey[600]
          }}
        />
      </div>
    )
  }
)
