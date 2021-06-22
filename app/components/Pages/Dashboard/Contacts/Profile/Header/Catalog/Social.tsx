import React from 'react'
import { makeStyles, Theme } from '@material-ui/core'

import { mdiWeb, mdiFacebook, mdiInstagram, mdiLinkedin } from '@mdi/js'

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
    item: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:not(:last-child)': {
        marginRight: theme.spacing(0.75)
      },
      '&:hover $icon': {
        color: theme.palette.secondary.main
      }
    },
    icon: {
      color: theme.palette.grey[700]
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
    if (!url.match(/^http?:\/\//i) || !url.match(/^https?:\/\//i)) {
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
          <a
            key={attr.id || attr.text}
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
        )
      })}
    </div>
  )
}
