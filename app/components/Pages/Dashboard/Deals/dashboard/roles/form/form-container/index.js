import React from 'react'
import { Field } from 'react-final-form'
import _ from 'underscore'
import { TextInput } from '../form-components/text-input'
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

  const pluralValues = form[pluralName] || []
  const singleValues = []

  if (_.size(pluralValues) > 0) {
    const values = []

    singularName.forEach(name => {
      pluralValues.forEach(item => item[name] && values.push(item[name]))
    })

    return values
  }

  singularName.forEach(name => {
    if (form[name]) {
      singleValues.push(form[name])
    }
  })

  return singleValues
}

export const RoleForm = ({
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
        singularName: ['company', 'company_title'],
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
        singularName: ['email'],
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
        singularName: ['phone_number'],
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
