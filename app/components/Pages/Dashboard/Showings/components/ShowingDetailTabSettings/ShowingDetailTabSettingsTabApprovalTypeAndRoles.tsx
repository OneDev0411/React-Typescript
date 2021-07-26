import { ReactNode } from 'react'

import { Box, Typography } from '@material-ui/core'

import ShowingApprovalTypeRadioGroup, {
  ShowingApprovalTypeRadioGroupProps
} from '../ShowingApprovalTypeRadioGroup'

import ShowingRoleList, { ShowingRoleListProps } from './ShowingRoleList'

interface ShowingDetailTabSettingsTabApprovalTypeAndRolesProps
  extends Pick<
    ShowingRoleListProps,
    'showingId' | 'hasNotificationTypeFields'
  > {
  approvalType: ShowingApprovalTypeRadioGroupProps['value']
  onApprovalTypeChange: ShowingApprovalTypeRadioGroupProps['onChange']
  roles: ShowingRoleListProps['value']
  onRolesChange: ShowingRoleListProps['onChange']

  children: ReactNode
}

function ShowingDetailTabSettingsTabApprovalTypeAndRoles({
  approvalType,
  onApprovalTypeChange,
  showingId,
  roles,
  onRolesChange,
  hasNotificationTypeFields,
  children
}: ShowingDetailTabSettingsTabApprovalTypeAndRolesProps) {
  return (
    <>
      <Box maxWidth={400} mb={2}>
        <Typography variant="h6" gutterBottom>
          Appointment Type
        </Typography>
        <ShowingApprovalTypeRadioGroup
          name="approvalType"
          value={approvalType}
          onChange={onApprovalTypeChange}
        />
      </Box>
      <ShowingRoleList
        showingId={showingId}
        value={roles}
        onChange={onRolesChange}
        hasNotificationTypeFields={hasNotificationTypeFields}
      >
        {children}
      </ShowingRoleList>
    </>
  )
}

export default ShowingDetailTabSettingsTabApprovalTypeAndRoles
