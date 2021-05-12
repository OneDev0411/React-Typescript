import React from 'react'
import { Box, Link, makeStyles, Theme } from '@material-ui/core'

import { mdiWeb, mdiFacebook, mdiInstagram, mdiLinkedin } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import SectionWithFields from '../../components/SectionWithFields'

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
      width: '24px',
      height: '24px',
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      borderRadius: '50%',
      '&:not(:last-child)': {
        marginRight: theme.spacing(0.5)
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

  return (
    <SectionWithFields
      contact={contact}
      section="Contact Info"
      fieldsFilter={fields}
      fieldsOrder={fields}
      renderer={({ attributes }) => (
        <Box className={classes.container}>
          {attributes.map(attr => {
            if (attr.isEmpty) {
              return null
            }

            return (
              <Link
                key={attr.cuid || attr.id}
                href={attr.text}
                target="_blank"
                className={classes.item}
              >
                <SvgIcon
                  path={fieldsIcon[attr.attribute_def.name]}
                  size={muiIconSizes.small}
                  className={classes.icon}
                />
              </Link>
            )
          })}
        </Box>
      )}
    />
  )
}
