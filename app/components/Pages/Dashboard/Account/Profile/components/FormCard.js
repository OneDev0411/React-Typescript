import React from 'react'

const Card = ({ title, children }) => (
  <article className="c-form-card">
    {title && (
      <header>
        <h3 className="c-form-card__title">{title}</h3>
      </header>
    )}
    <main className="c-form-card__body">{children}</main>
  </article>
)

export default Card
