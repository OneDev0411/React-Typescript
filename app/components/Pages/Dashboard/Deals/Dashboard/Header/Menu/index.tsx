import React from 'react'
import { withRouter, WithRouterProps } from 'react-router'

import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'

import { CloseButton } from 'components/Button/CloseButton'
import SendEmail from 'components/SendEmailButton'

import YardSign from 'deals/components/YardSign'
import OpenHouse from 'deals/components/OpenHouse'

import RemoveDraft from './RemoveDraft'
import DealStatus from '../../../components/DealStatus'

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
        borderColor: `${theme.palette.divider} !important`, // fix safari
        marginLeft: theme.spacing(1)
      }
    },
    closeButtonIcon: {
      fill: theme.palette.grey[600]
    }
  })
)

export const Menu = withRouter(
  ({ deal, isBackOffice, router, location }: Props & WithRouterProps) => {
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

        {deal.deal_type === 'Selling' && <YardSign deal={deal} />}

        <SendEmail deal={deal} size="small" />

        {deal.deal_type === 'Selling' && !deal.has_active_offer && (
          <Button
            size="small"
            color="secondary"
            variant="outlined"
            onClick={() =>
              router.push(`/dashboard/deals/${deal.id}/create-offer`)
            }
          >
            Add Offer
          </Button>
        )}

        <DealStatus deal={deal} isBackOffice={isBackOffice} />

        <CloseButton
          backUrl="/dashboard/deals"
          buttonProps={{
            size: 'medium'
          }}
          iconProps={{
            className: classes.closeButtonIcon,
            size: 'small'
          }}
        />
      </div>
    )
  }
)
