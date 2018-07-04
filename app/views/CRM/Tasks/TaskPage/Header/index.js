import React from 'react'
import PageHeader from '../../../../components/PageHeader'

export default function Header({ title }) {
  return <PageHeader title={title} backUrl="/crm/tasks" />
}
