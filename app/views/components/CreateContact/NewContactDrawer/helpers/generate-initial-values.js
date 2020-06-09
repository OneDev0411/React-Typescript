const INITIAL_VALUES = {
  first_name: '',
  last_name: '',
  tags: [],
  source: '',
  email: [{ label: { title: 'Personal', value: 'Personal' } }],
  phone_number: [{ label: { title: 'Mobile', value: 'Mobile' } }]
}

export function generateInitialValues(initValues) {
  let output = INITIAL_VALUES

  if (initValues) {
    const { email, ...restOfInitValues } = initValues

    output = {
      ...output,
      ...restOfInitValues
    }

    if (typeof email === 'string') {
      output.email = [
        { label: { title: 'Personal', value: 'Personal' }, initialValue: email }
      ]
    }
  }

  return output
}
