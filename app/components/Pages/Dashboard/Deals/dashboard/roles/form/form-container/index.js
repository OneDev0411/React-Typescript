import React from 'react'
import { Field } from 'react-final-form'
import _ from 'underscore'
import { TextInput } from '../../../../../../../../views/components/Forms/TextInput'
import { CommissionInput } from '../form-components/commission-input'
import { TitleDropDown } from '../form-components/title-dropdown'
import { RolesDropDown } from '../form-components/roles-dropdown'
import { AutoCompleteInput } from '../form-components/autocomplete-input'
import { FormContainer } from '../styles'
import { ROLE_NAMES } from '../../../../utils/roles'

const getDropDownItems = ({ form = {}, singularName, pluralName }) => {
  if (_.size(form) === 0) {
    return []
  }

  const values = form[pluralName] || []

  if (_.size(values) > 0) {
    return values.map(item => item[item.attribute_def.data_type])
  }

  // get single value
  const value = form[singularName]

  return value ? [value] : []
}

export const RoleFormContainer = ({
  form,
  handleSubmit,
  values,
  shouldShowCommission,
  isAllowedRole,
  requiredFields
}) => (
  <FormContainer onSubmit={handleSubmit}>
    <Field name="legal_prefix" placeholder="Title" component={TitleDropDown} />

    {_.map(
      {
        legal_first_name: 'Legal First Name',
        legal_middle_name: 'Legal Middle Name',
        legal_last_name: 'Legal Last Name'
      },
      (label, name) => (
        <Field
          key={name}
          name={name}
          placeholder={label}
          isRequired={requiredFields.includes(name)}
          component={TextInput}
        />
      )
    )}

    <Field
      name="company_title"
      placeholder="Company"
      component={AutoCompleteInput}
      defaultSelectedItem={form && form.email}
      isRequired={requiredFields.includes('company_title')}
      items={getDropDownItems({
        form,
        singularName: 'company',
        pluralName: 'companies'
      })}
    />

    <Field
      name="email"
      placeholder="Email"
      component={AutoCompleteInput}
      defaultSelectedItem={form && form.email}
      isRequired={requiredFields.includes('email')}
      items={getDropDownItems({
        form,
        singularName: 'email',
        pluralName: 'emails'
      })}
    />

    <Field
      name="phone_number"
      placeholder="Phone"
      component={AutoCompleteInput}
      defaultSelectedItem={form && form.phone_number}
      isRequired={requiredFields.includes('phone_number')}
      items={getDropDownItems({
        form,
        singularName: 'phone_number',
        pluralName: 'phones'
      })}
    />

    <Field
      name="role"
      isRequired={requiredFields.includes('role')}
      placeholder="Select Role"
      options={ROLE_NAMES}
      component={RolesDropDown}
      formRole={values.role}
      isAllowed={isAllowedRole}
    />

    {shouldShowCommission(values.role) && (
      <Field
        isRequired={requiredFields.includes('commission')}
        name="commission"
        placeholder="Commission"
        commissionType={values.commission_type}
        component={CommissionInput}
      />
    )}
  </FormContainer>
)
