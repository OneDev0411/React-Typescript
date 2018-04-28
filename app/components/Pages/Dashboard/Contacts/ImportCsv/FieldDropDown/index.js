import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'

// export const fields = [
//   {
//     value: 'title',
//     label: 'Name Title',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'name',
//     pluralName: 'names'
//   },
//   {
//     value: 'first_name',
//     label: 'First Name',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'name',
//     pluralName: 'names'
//   },
//   {
//     value: 'middle_name',
//     label: 'Middle Name',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'name',
//     pluralName: 'names'
//   },
//   {
//     value: 'last_name',
//     label: 'Last Name',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'name',
//     pluralName: 'names'
//   },
//   {
//     value: 'nickname',
//     label: 'Nick Name',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'name',
//     pluralName: 'names'
//   },
//   {
//     value: 'email',
//     label: 'Email',
//     dataType: 'email',
//     singularName: 'email',
//     pluralName: 'emails',
//     hasLabel: true
//   },
//   {
//     value: 'phone_number',
//     label: 'Phone Number',
//     dataType: 'phone',
//     singularName: 'phone_number',
//     pluralName: 'phone_numbers',
//     hasLabel: true
//   },
//   {
//     value: 'birthday',
//     label: 'Birthday',
//     dataType: 'date',
//     singularName: 'birthday',
//     pluralName: 'birthdays'
//   },
//   {
//     value: 'tag',
//     label: 'Tag',
//     dataType: 'string',
//     singularName: 'tag',
//     pluralName: 'tags'
//   },
//   {
//     value: 'profile_image_url',
//     label: 'Profile Image Url',
//     dataType: 'url',
//     singularName: 'profile_image_url',
//     pluralName: 'profile_image_url'
//   },
//   {
//     value: 'cover_image_url',
//     label: 'Cover Image Url',
//     dataType: 'url',
//     singularName: 'cover_image_url',
//     pluralName: 'cover_image_url'
//   },
//   {
//     value: 'company',
//     label: 'Comapny',
//     dataType: 'string',
//     singularName: 'company',
//     pluralName: 'companies'
//   },
//   {
//     value: 'stage',
//     label: 'Stage',
//     dataType: 'string',
//     singularName: 'stage',
//     pluralName: 'stages'
//   },
//   {
//     value: 'website',
//     label: 'Website',
//     dataType: 'string',
//     singularName: 'website',
//     pluralName: 'websites',
//     hasLabel: true
//   },
//   {
//     value: 'job_title',
//     label: 'Job Title',
//     dataType: 'string',
//     singularName: 'job_title',
//     pluralName: 'job_titles'
//   },
//   {
//     value: 'street_number',
//     label: 'Street Number',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'address',
//     pluralName: 'addresses',
//     hasLabel: true
//   },
//   {
//     value: 'street_prefix',
//     label: 'Street Prefix',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'address',
//     pluralName: 'addresses',
//     hasLabel: true
//   },
//   {
//     value: 'street_suffix',
//     label: 'Street Suffix',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'address',
//     pluralName: 'addresses',
//     hasLabel: true
//   },
//   {
//     value: 'street_name',
//     label: 'Street Name',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'address',
//     pluralName: 'addresses',
//     hasLabel: true
//   },
//   {
//     value: 'unit_number',
//     label: 'Unit',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'address',
//     pluralName: 'addresses',
//     hasLabel: true
//   },
//   {
//     value: 'city',
//     label: 'City',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'address',
//     pluralName: 'addresses',
//     hasLabel: true
//   },
//   {
//     value: 'state',
//     label: 'State',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'address',
//     pluralName: 'addresses',
//     hasLabel: true
//   },
//   {
//     value: 'country',
//     label: 'Country',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'address',
//     pluralName: 'addresses',
//     hasLabel: true
//   },
//   {
//     value: 'postal_code',
//     label: 'Postal Code',
//     dataType: 'string',
//     isSingleObject: true,
//     singularName: 'address',
//     pluralName: 'addresses',
//     hasLabel: true
//   },
//   {
//     value: 'source_type',
//     label: 'Source Type',
//     dataType: 'string',
//     singularName: 'source_type',
//     pluralName: 'source_types'
//   },
//   {
//     value: 'note',
//     label: 'Note',
//     dataType: 'string',
//     singularName: 'note',
//     pluralName: 'notes'
//   },
//   {
//     value: 'relation',
//     label: 'Relation',
//     dataType: 'string',
//     singularName: 'relation',
//     pluralName: 'relations'
//   },
//   {
//     value: 'contact',
//     label: 'Contact Id',
//     dataType: 'uuid',
//     singularName: 'relation',
//     pluralName: 'relations'
//   }
// ]

const FieldDropDown = ({ fieldName, value, onChange, attributes }) => (
  <Select
    name="form-field-name"
    value={value}
    onChange={data => onChange(fieldName, data ? data.value : null)}
    options={_.map(attributes, ({ id, label }) => ({
      value: id,
      label
    }))}
  />
)

function mapStateToProps({ contacts }) {
  return {
    attributes: contacts.attributeDefs.byId
  }
}

export default connect(mapStateToProps)(FieldDropDown)
