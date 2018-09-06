import React from 'react'
import { Field } from 'react-final-form'
import _ from 'underscore'
import { TextInput } from '../../../../../../../../views/components/Forms/TextInput'
import { CommissionInput } from '../form-components/commission-input'
import { TitleDropDown } from '../form-components/title-dropdown'
import { RolesDropDown } from '../form-components/roles-dropdown'
import { AutoCompleteInput } from '../form-components/autocomplete-input'
import { FormType } from '../form-components/type-input'
import { FormContainer } from '../styles'
import { ROLE_NAMES } from '../../../../utils/roles'

import { TYPE_PERSON } from '../form-components/type-input'

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
}) => {
  const { user_type } = values
  const isCompanyRequired = requiredFields.includes('company_title')
  const isFirstNameRequired = requiredFields.includes('legal_first_name')
  const isLastNameRequired = requiredFields.includes('legal_last_name')

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormType name="user_type" selectedValue={values.user_type} />

      {user_type === TYPE_PERSON && (
        <Field
          name="legal_prefix"
          placeholder="Title"
          component={TitleDropDown}
        />
      )}

      {(user_type === TYPE_PERSON || isFirstNameRequired) && (
        <Field
          parse={value => value || ''}
          name="legal_first_name"
          placeholder="Legal First Name"
          isRequired={isFirstNameRequired}
          component={TextInput}
        />
      )}

      {user_type === TYPE_PERSON && (
        <Field
          parse={value => value || ''}
          name="legal_middle_name"
          placeholder="Legal Middle Name"
          isRequired={false}
          component={TextInput}
        />
      )}

      {(user_type === TYPE_PERSON || isLastNameRequired) && (
        <Field
          parse={value => value || ''}
          name="legal_last_name"
          placeholder="Legal Last Name"
          isRequired={isLastNameRequired}
          component={TextInput}
        />
      )}

      <Field
        name="company_title"
        placeholder="Company/Trust"
        parse={value => value || ''}
        component={AutoCompleteInput}
        defaultSelectedItem={form && form.email}
        isRequired={isCompanyRequired}
        items={getDropDownItems({
          form,
          singularName: 'company',
          pluralName: 'companies'
        })}
      />

      <Field
        name="email"
        placeholder="Email"
        parse={value => value || ''}
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
        parse={value => value || ''}
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
}
