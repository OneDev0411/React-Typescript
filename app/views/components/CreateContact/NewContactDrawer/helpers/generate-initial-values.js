const INITIAL_VALUES = {
  first_name: '',
  last_name: '',
  middle_name: '',
  source: '',
  email: [{ label: { title: 'Personal', value: 'Personal' } }],
  phone_number: [{ label: { title: 'Mobile', value: 'Mobile' } }],
  title: { title: '-Select-', value: '-Select-' }
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
