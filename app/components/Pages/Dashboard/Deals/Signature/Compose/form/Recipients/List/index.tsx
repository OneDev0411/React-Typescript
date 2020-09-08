import React from 'react'
import { useField } from 'react-final-form'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  MenuItem,
  MenuList,
  Typography,
  Box,
  Theme,
  TableContainer,
  makeStyles
} from '@material-ui/core'

import { useTheme } from '@material-ui/styles'
import { mdiClose } from '@mdi/js'

import { BaseDropdown } from 'components/BaseDropdown'
import { Avatar } from 'components/Avatar'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import type { ISignatureRecipient } from 'deals/Signature/types'
import { getAvatarTitle } from 'deals/utils/get-avatar-title'
import { roleName, getLegalFullName } from 'deals/utils/roles'

const useStyles = makeStyles(
  (theme: Theme) => ({
    cell: {
      padding: theme.spacing(0.5, 0)
    }
  }),
  { name: 'ListTable' }
)

export function RecipientsList() {
  const classes = useStyles()
  const theme = useTheme<Theme>()

  const { input } = useField('recipients')

  const list = Object.values(input.value || {})

  const handleOrderChange = (recipient: ISignatureRecipient, order: number) => {
    input.onChange({
      ...input.value,
      [recipient.id]: {
        ...recipient,
        order
      }
    })
  }

  const handleChangeType = (
    recipient: ISignatureRecipient,
    type: ISignatureRecipient['envelope_recipient_type']
  ) => {
    input.onChange({
      ...input.value,
      [recipient.id]: {
        ...recipient,
        envelope_recipient_type: type
      }
    })
  }

  const handleRemoveRecipient = (recipient: ISignatureRecipient) => {
    input.onChange(
      list.filter((item: typeof recipient) => item.id !== recipient.id)
    )
  }

  const getRecipientType = (recipient: ISignatureRecipient) => {
    switch (recipient.envelope_recipient_type) {
      case 'CarbonCopy':
        return 'CC'
      case 'Signer':
        return 'Need To Sign'

      default:
        return ''
    }
  }

  if (list.length === 0) {
    return null
  }

  return (
    <Box mb={1}>
      {list.length > 0 && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className={classes.cell}>Order</TableCell>
                <TableCell className={classes.cell}>Recipient</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {list.map((recipient: ISignatureRecipient, index) => (
                <TableRow key={index}>
                  <TableCell
                    className={classes.cell}
                    style={{
                      width: '5%'
                    }}
                  >
                    <BaseDropdown
                      buttonLabel={recipient.order}
                      renderMenu={({ close }) => {
                        return (
                          <MenuList>
                            {list.map((_, index) => (
                              <MenuItem
                                key={index}
                                onClick={() => {
                                  close()
                                  handleOrderChange(recipient, index + 1)
                                }}
                              >
                                {index + 1}
                              </MenuItem>
                            ))}
                          </MenuList>
                        )
                      }}
                    />
                  </TableCell>

                  <TableCell
                    className={classes.cell}
                    style={{
                      width: '70%'
                    }}
                  >
                    <Box display="flex">
                      <Avatar
                        alt={getAvatarTitle(recipient)}
                        user={recipient?.user as IUser}
                        style={{
                          width: theme.spacing(4),
                          height: theme.spacing(4),
                          marginRight: theme.spacing(1)
                        }}
                      />

                      <div>
                        <Typography variant="body2">
                          {getLegalFullName(recipient)}
                        </Typography>

                        <Typography variant="caption">
                          {roleName(recipient.role)}
                        </Typography>
                      </div>
                    </Box>
                  </TableCell>

                  <TableCell
                    className={classes.cell}
                    style={{
                      width: '20%'
                    }}
                  >
                    <BaseDropdown
                      buttonLabel={getRecipientType(recipient)}
                      renderMenu={({ close }) => {
                        return (
                          <MenuList>
                            <MenuItem
                              onClick={() => {
                                close()
                                handleChangeType(recipient, 'Signer')
                              }}
                            >
                              Need To Sign
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                close()
                                handleChangeType(recipient, 'CarbonCopy')
                              }}
                            >
                              CC
                            </MenuItem>
                          </MenuList>
                        )
                      }}
                    />
                  </TableCell>
                  <TableCell
                    className={classes.cell}
                    align="right"
                    style={{
                      width: '5%'
                    }}
                  >
                    <IconButton
                      size="medium"
                      onClick={() => handleRemoveRecipient(recipient)}
                    >
                      <SvgIcon path={mdiClose} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
