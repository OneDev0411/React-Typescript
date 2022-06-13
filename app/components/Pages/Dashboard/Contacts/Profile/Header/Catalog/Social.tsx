import { makeStyles, Theme, Tooltip } from '@material-ui/core'
import {
  mdiWeb,
  mdiFacebook,
  mdiInstagram,
  mdiLinkedin,
  mdiEmailOutline
} from '@mdi/js'

import { normalizeContactsForEmailCompose } from '@app/models/email/helpers/normalize-contact'
import SendEmailButton from '@app/views/components/SendEmailButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const fields = ['website', 'facebook', 'instagram', 'linkedin']
const fieldsIcon = {
  website: mdiWeb,
  facebook: mdiFacebook,
  linkedin: mdiLinkedin,
  instagram: mdiInstagram
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center'
    },
    tooltip: {
      textTransform: 'capitalize'
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: theme.spacing(0, 0.25),
      '&:hover $icon': {
        color: theme.palette.secondary.main
      }
    },
    icon: {
      color: theme.palette.grey[700],
      borderRadius: '50%',
      border: `1px solid ${theme.palette.grey[400]}`,
      padding: theme.spacing(0.25)
    }
  }),
  {
    name: 'ContactProfileHeaderSocial'
  }
)

interface Props {
  contact: INormalizedContact
}

export const Social = ({ contact }: Props) => {
  const classes = useStyles()

  const getUrl = url => {
    if (!url.match(/^http(s?)?:\/\//i)) {
      return `http://${url}`
    }

    return url
  }

  return (
    <div className={classes.container}>
      {(contact.attributes || []).map(attr => {
        if (!fields.includes(attr.attribute_def?.name!) || !attr.text) {
          return null
        }

        return (
          <Tooltip
            key={attr.id || attr.text}
            classes={{ tooltip: classes.tooltip }}
            title={attr.attribute_def.name || 'Social'}
          >
            <a
              href={getUrl(attr.text)}
              target="_blank"
              rel="nofollow noreferrer noopener"
              className={classes.item}
            >
              <SvgIcon
                path={fieldsIcon[attr.attribute_def.name!]}
                className={classes.icon}
              />
            </a>
          </Tooltip>
        )
      })}

      <SendEmailButton
        recipients={normalizeContactsForEmailCompose([contact])}
        render={({ onClick, testId }) => (
          <Tooltip title="Send Email">
            <div className={classes.item} onClick={onClick}>
              <SvgIcon path={mdiEmailOutline} className={classes.icon} />
            </div>
          </Tooltip>
        )}
      />
    </div>
  )
}
