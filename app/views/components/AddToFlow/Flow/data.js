import cuid from 'cuid'

export const mockData = [
  {
    id: cuid(),
    name: 'Tier 1 - C Level',
    description: 'Tailored flow for C level executives with heavy customiztion',
    steps: [
      { task_type: 'call', label: 'Call', day: 1, auto: false },
      { task_type: 'meeting', label: 'In Person Metting', day: 3, auto: false },
      { task_type: 'text', label: 'Text Message', day: 5, auto: false },
      { task_type: 'email', label: 'Auto Email', day: 7, auto: true },
      { task_type: 'follow', label: 'Follow up', day: 8, auto: false }
    ]
  },
  {
    id: cuid(),
    name: 'Tier 2 - Decision Maker',
    description: 'Tailored flow for C level executives with heavy customiztion',
    steps: [
      { task_type: 'call', label: 'Call', day: 1, auto: false },
      { task_type: 'meeting', label: 'In Person Metting', day: 3, auto: false }
    ]
  },
  {
    id: cuid(),
    name: 'Tier 3 - Influencer',
    description: 'Tailored flow for D influencer with strong automation',
    steps: [
      { task_type: 'call', label: 'Call', day: 1, auto: false },
      { task_type: 'meeting', label: 'In Person Metting', day: 3, auto: false },
      { task_type: 'text', label: 'Text Message', day: 5, auto: false }
    ]
  },
  {
    id: cuid(),
    name: 'Tier 4',
    description: 'Tailored flow for influencer with strong automation',
    steps: [
      { task_type: 'call', label: 'Call', day: 1, auto: false },
      { task_type: 'meeting', label: 'In Person Metting', day: 5, auto: false },
      { task_type: 'text', label: 'Text Message', day: 9, auto: false },
      { task_type: 'email', label: 'Auto Email', day: 12, auto: true },
      { task_type: 'follow', label: 'Follow up', day: 15, auto: false },
      { task_type: 'follow', label: 'Follow up', day: 25, auto: false }
    ]
  }
]
