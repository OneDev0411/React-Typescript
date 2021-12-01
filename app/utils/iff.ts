export default function iff<T>(
  condition: unknown,
  trueResult: T,
  falseResult?: T
): Optional<T> {
  if (condition) {
    return trueResult
  }

  return falseResult
}
