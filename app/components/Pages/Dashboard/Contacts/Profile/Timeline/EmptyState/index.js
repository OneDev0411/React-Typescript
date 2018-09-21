import React from 'react'
import Flex from 'styled-flex-component'

const Container = Flex.extend`
  max-width: 558px;
  padding: 1em 0;
  color: #9c9c9c;
  text-align: center;
  font-size: 24px;
  margin: 0 auto;
`

export function EmptyState() {
  return (
    <Container column center>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="122"
        style={{ marginBottom: '2em' }}
      >
        <path
          fill="#CCC"
          d="M2.248 26.2c-.526.472-1.874 1.3-1.78-.057.8-5.464 1.817-10.877 3.116-16.314l.624-2.61c-.457-1.167-.914-2.333-1.436-3.423C2.315 2.629 5.9-1.021 6.51.274c.255.475.445 1.026.7 1.5C7.992.997 9.005.412 9.964.825c.883.349 1.839 1.543 2.464 2.198.932.912 1.787 1.76 2.718 2.672a110.323 110.323 0 0 1 5.357 6.062c3.506 4.378 6.333 9.099 8.761 14.14.432.884-2.06 3.232-2.39 2.693a99.79 99.79 0 0 0-9.56-12.721c-1.658-1.914-3.38-3.75-5.231-5.434-.613-.514-1.085-1.04-1.698-1.555C21.04 34.919 24.72 63.984 22.256 91.81a170.917 170.917 0 0 1-4.443 26.296c-.324 1.164-1.147 2.301-2.149 3.028-.398.318-1.975.953-1.65-.21 7.35-30.385 6.6-62.474-2.196-92.439-1.52-5.19-3.396-10.42-5.261-15.51-.639 3.25-1.213 6.423-1.634 9.725-.235 1.37-1.61 2.696-2.675 3.5z"
        />
      </svg>
      <p>
        Adding an event can act like tasks, appointments, reminders and
        historical logs of activities.
      </p>
    </Container>
  )
}
