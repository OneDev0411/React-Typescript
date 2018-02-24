import React from 'react'
import MultiFields from '../components/MultiFields'

export default function Jobs({ contact }) {
  const validator = text => {
    /*
     * Not Allowing Special Characters
     * Validate the text that contains special characters.
    */
    const regular = /\`|\~|\d|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:/

    return !new RegExp(regular).exec(text)
  }

  return (
    <MultiFields
      type="job_title"
      name="job_titles"
      title="Job Title"
      contact={contact}
      placeholder="Lawyer"
      validator={validator}
      validationText="Please include only letters and space. You have added a number or special character."
    />
  )
}
