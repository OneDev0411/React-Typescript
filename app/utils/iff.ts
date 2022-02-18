export default function iff<T>(
  condition: boolean,
  trueResult: T,
  falseResult?: T
): Optional<T> {
  if (condition) {
    return trueResult
  }

  return falseResult
}
