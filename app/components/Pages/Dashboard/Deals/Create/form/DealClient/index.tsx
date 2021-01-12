import React, { useState } from 'react'
import {
  Box,
  makeStyles,
  TextField,
  Theme,
  Typography,
  Avatar
} from '@material-ui/core'

import cn from 'classnames'
import { useDebounce, useAsync } from 'react-use'

import { mdiPlus } from '@mdi/js'

import { searchContacts } from 'models/contacts/search-contacts'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardForm } from 'components/QuestionWizard/use-context'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { DealRole } from 'components/DealRole'

import { RoleCard } from '../../components/RoleCard'

import { useFormContext } from '../../context/use-form-context'
import { convertContactToRole } from '../../../utils/roles'

import type { IDealFormPrimaryAgent } from '../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      maxHeight: '40vh',
      overflow: 'auto',
      '&.has-border': {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius
      }
    },
    row: {
      padding: theme.spacing(1),
      '&:hover': {
        background: theme.palette.action.hover,
        cursor: 'pointer'
      }
    },
    newClientAvatar: {
      border: `1px solid ${theme.palette.secondary.main}`,
      backgroundColor: '#fff'
    },
    newClient: {
      color: theme.palette.secondary.main
    },
    rowContent: {
      paddingLeft: theme.spacing(2)
    },
    email: {
      color: theme.palette.grey[500]
    },
    searchInput: {
      padding: theme.spacing(1.5)
    }
  }),
  {
    name: 'CreateDeal-PrimaryAgent'
  }
)

interface Props {
  step?: number
  title: string
  side: IDealType
}

export function DealClient({ step, side, title }: Props) {
  const classes = useStyles()
  const wizard = useWizardForm()
  const context = useFormContext()

  const [selectedRole, setSelectedRole] = useState<
    Nullable<Partial<IDealFormPrimaryAgent>>
  >(null)

  const [contacts, setContacts] = useState<IContact[]>([])

  const [searchCriteria, setSearchCriteria] = useState<string>('')
  const [debouncedSearchCriteria, setDebouncedSearchCriteria] = useState<
    string
  >('')

  useDebounce(
    () => {
      setDebouncedSearchCriteria(searchCriteria)
    },
    700,
    [searchCriteria]
  )

  useAsync(async () => {
    if (searchCriteria.length < 3) {
      return
    }

    const { data: contacts } = await searchContacts(searchCriteria)

    setContacts(contacts)
  }, [debouncedSearchCriteria])

  if (!context.form.side) {
    return null
  }

  const allowedRoles = getRoles(context.form.side)

  const createNewContact = () => {
    const name = debouncedSearchCriteria.split(' ')

    setSelectedRole({
      legal_first_name: name[0],
      legal_last_name: name[1]
    })
  }

  const handleUpsert = (client: IDealFormPrimaryAgent) => {
    console.log('>>>', client)
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>{title}</QuestionTitle>

      {selectedRole ? (
        <Box mt={1}>
          <DealRole
            isOpen
            user={context.user}
            dealSide={context.form.side}
            form={selectedRole}
            allowedRoles={allowedRoles}
            onUpsertRole={handleUpsert}
            onClose={() => setSelectedRole(null)}
          />
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap">
          {/* {[].map(agent => (
            <RoleCard
              key={agent.id}
              agent={agent}
              onClickEdit={() => setSelectedRole(agent)}
              onClickRemove={() => handleRemove(agent)}
            />
          ))} */}
        </Box>
      )}

      <QuestionForm>
        <Box
          className={cn(classes.root, {
            'has-border': contacts.length > 0
          })}
          style={{
            display: !selectedRole ? 'block' : 'none'
          }}
        >
          <TextField
            onChange={e => setSearchCriteria(e.target.value)}
            placeholder="Search name or office"
            size="medium"
            className={classes.searchInput}
            fullWidth
          />

          {debouncedSearchCriteria && (
            <Box
              display="flex"
              alignItems="center"
              className={cn(classes.row, classes.newClient)}
              onClick={createNewContact}
            >
              <Avatar className={classes.newClientAvatar}>
                <SvgIcon path={mdiPlus} className={classes.newClient} />
              </Avatar>

              <div className={classes.rowContent}>
                Add <strong>{searchCriteria}</strong>
              </div>
            </Box>
          )}

          {contacts.map(contact => (
            <Box
              key={contact.id}
              display="flex"
              className={classes.row}
              onClick={() => setSelectedRole(convertContactToRole(contact))}
            >
              <Avatar
                src={contact.profile_image_url!}
                alt={contact.display_name}
              />

              <div className={classes.rowContent}>
                <Typography variant="body2">{contact.display_name}</Typography>

                <Typography variant="body2" className={classes.email}>
                  {contact.email}
                </Typography>
              </div>
            </Box>
          ))}
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}

function getRoles(type: IDealType) {
  if (type === 'Buying') {
    return ['Buyer', 'BuyerPowerOfAttorney', 'Tenant', 'TenantPowerOfAttorney']
  }

  if (type === 'Selling') {
    return [
      'Seller',
      'SellerPowerOfAttorney',
      'Landlord',
      'LandlordPowerOfAttorney'
    ]
  }

  return []
}
