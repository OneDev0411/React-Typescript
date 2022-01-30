import { Typography, makeStyles } from '@material-ui/core'
import { mdiHomeOutline, mdiDrag, mdiClose, mdiDatabaseOutline } from '@mdi/js'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import {
  addressTitle,
  getAddressLine2,
  getListingAddressObj,
  getStatusColorClass
} from '@app/utils/listing'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { grey } from '@app/views/utils/colors'

import {
  ListItem,
  ListItemImage,
  ListItemAddress,
  MlsDetailsContainer,
  DetailsContainer,
  AddressContainer,
  Status,
  Address,
  IconContainer
} from '../styled'

export const useStyles = makeStyles(
  theme => ({
    mlsSource: {
      ...theme.typography.caption,
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.grey[700]
    },
    mlsSourceIcon: {
      maxWidth: 14, // From figma
      maxHeight: 14, // From figma
      marginRight: theme.spacing(0.5)
    }
  }),
  {
    name: 'SeachListingDrawerListingItem'
  }
)

export function MlsItem({ item, onClickRemove, ...props }) {
  const classes = useStyles()

  const getStatus = () => {
    const { status, close_date } = item

    if ((status === 'Sold' || status === 'Leased') && close_date) {
      return `${status} ${fecha.format(
        new Date(close_date * 1000),
        'mediumDate'
      )}`
    }

    return status
  }

  const address = getListingAddressObj(item)

  if (!address) {
    return null
  }

  return (
    <ListItem {...props} className="c-search-listings__mls-item">
      {props.isDraggable && <SvgIcon path={mdiDrag} rightMargined />}

      <Flex style={{ width: '100%' }} justifyBetween alignCenter>
        <AddressContainer>
          {item.cover_image_url ? (
            <ListItemImage alt="" src={item.cover_image_url} />
          ) : (
            <IconContainer center>
              <SvgIcon path={mdiHomeOutline} />
            </IconContainer>
          )}
          <ListItemAddress>
            <Address style={{ fontWeight: '500' }}>
              {typeof address === 'string' ? address : addressTitle(address)}
            </Address>

            <Address style={{ color: grey.A550 }}>
              {typeof address === 'object' && <>{getAddressLine2(address)},</>}{' '}
              ${item.price.toLocaleString()}
            </Address>
          </ListItemAddress>
        </AddressContainer>

        <DetailsContainer>
          <MlsDetailsContainer>
            <Status
              style={{
                backgroundColor: getStatusColorClass(item.status)
              }}
            >
              {getStatus()}
            </Status>
            <Typography
              component="p"
              variant="caption"
              color="textSecondary"
              title="Listing Provider (MLS) Source"
              className={classes.mlsSource}
            >
              <SvgIcon
                path={mdiDatabaseOutline}
                className={classes.mlsSourceIcon}
              />{' '}
              {item.mls_display_name}
            </Typography>
          </MlsDetailsContainer>

          {props.removable && onClickRemove && (
            <SvgIcon
              path={mdiClose}
              className="delete-icon"
              onClick={onClickRemove}
            />
          )}
        </DetailsContainer>
      </Flex>
    </ListItem>
  )
}
