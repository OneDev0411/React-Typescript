import React from 'react'
import { Typography, makeStyles, createStyles, Theme } from '@material-ui/core'

import Flex from 'styled-flex-component'

import { DropdownToggleButton } from 'components/DropdownToggleButton'

import Avatar from 'components/Avatar'

interface SelectedItem {
  label: string
  value: any
}

interface Props {
  selectedItem: SelectedItem
  isOpen: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      marginRight: theme.spacing(1)
    },
    title: {
      textAlign: 'left',
      lineHeight: 0.8
    }
  })
)

export function AgentPickerButton({ selectedItem, isOpen, ...rest }: Props) {
  const classes = useStyles()

  return (
    <DropdownToggleButton isActive={isOpen} {...rest}>
      <Flex>
        <div className={classes.avatar}>
          {/*
        // @ts-ignore js component */}
          <Avatar
            size={36}
            title={selectedItem.label}
            image={selectedItem.value.profile_image_url}
          />
        </div>

        <div className={classes.title}>
          <Typography variant="caption" color="textSecondary">
            Send As
          </Typography>
          <Typography variant="subtitle2">{selectedItem.label}</Typography>
        </div>
      </Flex>
    </DropdownToggleButton>
  )
}
