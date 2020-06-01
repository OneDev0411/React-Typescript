import React from 'react'
import { withRouter, WithRouterProps } from 'react-router'

import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'

import { CloseButton } from 'components/Button/CloseButton'
import SendEmail from 'components/SendEmailButton'

import { getActiveTeamSettings } from 'utils/user-teams'
import {
  OPEN_HOUSE_REQUESTS_SETTINGS_KEY,
  YARD_SIGN_REQUESTS_SETTINGS_KEY
} from 'constants/user'

import YardSign from 'deals/components/YardSign'
import OpenHouse from 'deals/components/OpenHouse'

import RemoveDraft from './RemoveDraft'
import DealStatus from '../../../components/DealStatus'

interface Props {
  deal: IDeal
  user: IUser
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
    },
    closeButtonIcon: {
      fill: theme.palette.grey[600]
    }
  })
)

export const Menu = withRouter(
  ({ deal, user, isBackOffice, router, location }: Props & WithRouterProps) => {
    const classes = useStyles()
    const activeBrandSettings = getActiveTeamSettings(user, '', true)
    const showYardSign = activeBrandSettings[YARD_SIGN_REQUESTS_SETTINGS_KEY]
    const showOpenHouse = activeBrandSettings[OPEN_HOUSE_REQUESTS_SETTINGS_KEY]

    return (
      <div className={classes.container}>
        {deal.is_draft === true && <RemoveDraft deal={deal} />}

        {showOpenHouse && deal.deal_type === 'Selling' && (
          <OpenHouse
            deal={deal}
            defaultOpen={(location.state || {}).autoBookOpenHouse}
          />
        )}

        {showYardSign && <YardSign deal={deal} />}

        <SendEmail deal={deal} size="small" />

        {deal.deal_type === 'Selling' && !deal.has_active_offer && (
          <Button
            size="small"
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
