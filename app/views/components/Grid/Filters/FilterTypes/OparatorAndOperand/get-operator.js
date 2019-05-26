export default function getOperator(props) {
  const { allowedOperators } = props

  return (
    props.operator ||
    Object.values(allowedOperators).find(
      operator => operator.default === true
    ) ||
    allowedOperators[0]
  )
}
