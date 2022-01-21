import {
  Button,
  createStyles,
  IconButton,
  makeStyles,
  Theme
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import { withRouter, WithRouterProps } from 'react-router'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { getSettingFromTeam } from '@app/utils/user-teams'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import OpenHouse from 'deals/components/OpenHouse'
import YardSign from 'deals/components/YardSign'

import DealStatus from '../../../components/DealStatus'
import { DEAL_GRID_FILTER_SETTING_KEY } from '../../../constants/settings'
import { useGetOriginQueryParam } from '../../../hooks/use-get-origin-query-param'

import { Email } from './Email'
import { MakeVisible } from './MakeVisibleToOffice'

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
    const classes = useStyles()
    const activeTeam = useUnsafeActiveTeam()
    const originQueryParam = useGetOriginQueryParam()

    const handleClose = () => {
      const { origin } = location.query

      if (origin) {
        router.push(`/${origin}`)

        return
      }

      const query = getSettingFromTeam(activeTeam, DEAL_GRID_FILTER_SETTING_KEY)

      router.push(`/dashboard/deals?q=${query?.term || ''}`)
    }

    return (
      <div className={classes.container}>
        {deal.is_draft && <MakeVisible deal={deal} />}

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
            onClick={() =>
              router.push(
                `/dashboard/deals/${deal.id}/offer?${originQueryParam}`
              )
            }
          >
            Add Offer
          </Button>
        )}

        <DealStatus deal={deal} isBackOffice={isBackOffice} />

        <IconButton size="small" onClick={handleClose}>
          <SvgIcon path={mdiClose} />
        </IconButton>
      </div>
    )
  }
)
