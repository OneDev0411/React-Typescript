import cuid from 'cuid'

export const mockData = [
  {
    id: cuid(),
    name: 'Tier 1 - C Level',
    description: 'Tailored flow for C level executives with heavy customiztion',
    steps: [
      {
        id: cuid(),
        event: { task_type: 'Call' },
        title: 'Call',
        due_in: 288000,
        auto: false
      },
      {
        id: cuid(),
        event: { task_type: 'In-Person Meeting' },
        title: 'In Person Metting',
        due_in: 398000,
        auto: false
      },
      {
        id: cuid(),
        event: { task_type: 'Text' },
        title: 'Text Message',
        due_in: 400000,
        auto: false
      },
      {
        id: cuid(),
        event: { task_type: 'Email' },
        title: 'Auto Email',
        due_in: 450000,
        auto: true
      },
      {
        id: cuid(),
        event: { task_type: 'Follow Up' },
        title: 'Follow up',
        due_in: 600000,
        auto: false
      }
    ]
  },
  {
    id: cuid(),
    name: 'Tier 2 - Decision Maker',
    description: 'Tailored flow for C level executives with heavy customiztion',
    steps: [
      {
        id: cuid(),
        event: { task_type: 'In-Person Meeting' },
        title: 'In Person Metting',
        due_in: 398000,
        auto: false
      },
      {
        id: cuid(),
        event: { task_type: 'Email' },
        title: 'Auto Email',
        due_in: 450000,
        auto: true
      },
      {
        id: cuid(),
        event: { task_type: 'Follow Up' },
        title: 'Follow up',
        due_in: 600000,
        auto: false
      }
    ]
  },
  {
    id: cuid(),
    name: 'Tier 3 - Influencer',
    description: 'Tailored flow for D influencer with strong automation',
    steps: [
      {
        id: cuid(),
        event: { task_type: 'Call' },
        title: 'Call',
        due_in: 288000,
        auto: false
      },
      {
        id: cuid(),
        event: { task_type: 'In-Person Meeting' },
        title: 'In Person Metting',
        due_in: 398000,
        auto: false
      },
      {
        id: cuid(),
        event: { task_type: 'Text' },
        title: 'Text Message',
        due_in: 400000,
        auto: false
      },
      {
        id: cuid(),
        event: { task_type: 'Follow Up' },
        title: 'Follow up',
        due_in: 600000,
        auto: false
      }
    ]
  },
  {
    id: cuid(),
    name: 'Tier 4',
    description: 'Tailored flow for influencer with strong automation',
    steps: [
      {
        id: cuid(),
        event: { task_type: 'Call' },
        title: 'Call',
        due_in: 288000,
        auto: false
      },
      {
        id: cuid(),
        event: { task_type: 'In-Person Meeting' },
        title: 'In Person Metting',
        due_in: 398000,
        auto: false
      },
      {
        id: cuid(),
        event: { task_type: 'Text' },
        title: 'Text Message',
        due_in: 400000,
        auto: false
      },
      {
        id: cuid(),
        event: { task_type: 'Email' },
        title: 'Auto Email',
        due_in: 450000,
        auto: true
      },
      {
        id: cuid(),
        event: { task_type: 'Follow Up' },
        title: 'Follow up',
        due_in: 600000,
        auto: false
      },
      {
        id: cuid(),
        event: { task_type: 'Call' },
        title: 'Call',
        due_in: 900000,
        auto: false
      }
    ]
  }
]
