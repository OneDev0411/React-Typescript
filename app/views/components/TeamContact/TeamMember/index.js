import React from 'react'
import styled from 'styled-components'
import Flex from 'styled-flex-component'
import { Typography, makeStyles } from '@material-ui/core'
import { mdiCheck } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { Avatar } from 'components/Avatar'

import { Item } from '../../Dropdown/Item'

const Container = styled(Item)`
  pointer-events: ${props => (props.isDisabled ? 'none' : 'initial')};
`

const useStyles = makeStyles(
  theme => ({
    icon: {
      marginLeft: theme.spacing(4)
    }
  }),
  { name: 'TeamMember' }
)

export function TeamMember(props) {
  const classes = useStyles()
  const { user, title } = props

  if (!user) {
    return null
  }

  const info = [user.email, user.phone_numner].filter(i => i != null).join(', ')

  return (
    <Container {...props}>
      <Avatar user={user} alt={title} />
      <Flex
        column
        style={{
          width: `calc(100% - ${props.isSelected ? '7em' : '3.5em'})`,
          marginLeft: '1em'
        }}
      >
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>
        <Typography variant="caption" noWrap>
          {info}
        </Typography>
      </Flex>
      {props.isSelected && <SvgIcon path={mdiCheck} className={classes.icon} />}
    </Container>
  )
}
