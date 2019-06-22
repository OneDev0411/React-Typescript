export default [
  {
    id: '88c7100a-9ed1-11e7-8c9b-0242ac110003',
    created_at: 1506000843.81902,
    updated_at: 1506000843.81902,
    palette: {
      primary: '#af5353',
      type: 'brand_palette'
    },
    assets: null,
    messages: {
      type: 'brand_messages'
    },
    parent: {
      id: 'f8ba68ec-9ded-11e7-b2b3-0242ac110003',
      created_at: 1505903106.38657,
      updated_at: 1505903106.38657,
      palette: {
        type: 'brand_palette'
      },
      assets: null,
      messages: {
        type: 'brand_messages'
      },
      parent: {
        id: '8cb4a358-8973-11e7-9089-0242ac110003',
        created_at: 1503651503.29826,
        updated_at: 1503651503.29826,
        palette: {
          primary: '#3e77b9',
          type: 'brand_palette'
        },
        assets: null,
        messages: {
          site_title: 'Main Office',
          listing_url: 'http://www.briggsfreeman.com/ecard.asp?L=%1',
          branch_title: 'Root Office',
          office_title: 'Main Office',
          type: 'brand_messages'
        },
        parent: null,
        name: 'Main Office',
        deleted_at: null,
        training: false,
        brand_type: 'Other',
        type: 'brand',
        offices: ['RCHT01'],
        hostnames: ['main.irish.rechat.com'],
        roles: [
          {
            id: '61cae236-a38d-11e7-8f3b-0242ac110003',
            brand: '8cb4a358-8973-11e7-9089-0242ac110003',
            created_at: 1506521328.41907,
            updated_at: 1506521328.41907,
            deleted_at: null,
            role: 'Admin',
            acl: ['Admin'],
            type: 'brand_role',
            users: null
          },
          {
            id: '7071f300-9de9-11e7-ab6a-0242ac110003',
            brand: '8cb4a358-8973-11e7-9089-0242ac110003',
            created_at: 1505901159.75427,
            updated_at: 1505901159.75427,
            deleted_at: null,
            role: 'Admin',
            acl: ['Admin', 'Backoffice', 'BackOffice', 'CRM'],
            type: 'brand_role',
            users: [
              {
                id: 'abe16fd8-0784-11e8-98fe-0ae785638eb4',
                user: {
                  type: 'user',
                  username: null,
                  first_name: 'Emil',
                  last_name: 'Agent',
                  email: 'emil+agent@rechat.com',
                  phone_number: '+14243828604',
                  created_at: 1495029776.62289,
                  id: '8725b638-3b09-11e7-b651-0242ac110003',
                  address_id: null,
                  cover_image_url: '',
                  profile_image_url:
                    'https://d2dzyv4cb7po1i.cloudfront.net/8725b638-3b09-11e7-b651-0242ac110003/5de57a10-8dc3-11e9-8560-2b72482e66f1.jpg',
                  updated_at: 1560793972.2309,
                  user_status: 'Active',
                  profile_image_thumbnail_url: null,
                  cover_image_thumbnail_url: null,
                  email_confirmed: true,
                  timezone: 'America/Los_Angeles',
                  user_type: 'Agent',
                  deleted_at: null,
                  phone_confirmed: true,
                  agent: {
                    id: '80fe6220-a26f-11e5-8446-f23c91c841bd',
                    email: 'etebari_peyman@yahoo.com',
                    mlsid: '0530796',
                    fax: null,
                    full_name: 'Peyman Etebari',
                    first_name: 'Peyman',
                    last_name: 'Etebari',
                    middle_name: null,
                    phone_number: '(972) 989-9701',
                    nar_number: '791509740',
                    office_mui: 52549046,
                    status: 'Active',
                    office_mlsid: 'ETEB01',
                    work_phone: '(972) 989-9701',
                    generational_name: null,
                    matrix_unique_id: 15553885,
                    updated_at: 1451139644.92396,
                    deleted_at: null,
                    created_at: 1452542709.26428,
                    type: 'agent',
                    user_id: '8725b638-3b09-11e7-b651-0242ac110003',
                    office_id: '90c4f0e0-b97e-11e5-94c9-f23c91c841bd',
                    profile_image_url:
                      'https://d2dzyv4cb7po1i.cloudfront.net/8725b638-3b09-11e7-b651-0242ac110003/5de57a10-8dc3-11e9-8560-2b72482e66f1.jpg',
                    cover_image_url: '',
                    secret_questions: [
                      '(972) XXX-XX01',
                      'etebarxxxxxxxxxxxxoo.com'
                    ]
                  },
                  is_shadow: false,
                  personal_room: '87277932-3b09-11e7-b651-0242ac110003',
                  brand: '88c7100a-9ed1-11e7-8c9b-0242ac110003',
                  fake_email: false,
                  features: ['Deals'],
                  last_seen_at: 1561209127.564,
                  email_signature: null,
                  current_time: '6:37 AM - Saturday Jun 22, 2019',
                  push_allowed: false,
                  last_seen_type: 'Web',
                  has_docusign: true,
                  active_brand: '88c7100a-9ed1-11e7-8c9b-0242ac110003',
                  display_name: 'Emil Agent',
                  abbreviated_display_name: 'Emil',
                  online_state: 'Online'
                },
                role: '7071f300-9de9-11e7-ab6a-0242ac110003',
                deleted_at: null,
                type: 'brand_user'
              }
            ]
          }
        ],
        member_count: 8,
        base_url: 'https://main.irish.rechat.com'
      },
      name: 'Rechat Back Office',
      deleted_at: null,
      training: false,
      brand_type: 'Other',
      type: 'brand',
      offices: [],
      hostnames: null,
      roles: [
        {
          id: 'f8e32688-9ded-11e7-b2b3-0242ac110003',
          brand: 'f8ba68ec-9ded-11e7-b2b3-0242ac110003',
          created_at: 1505903106.64251,
          updated_at: 1505903106.64251,
          deleted_at: null,
          role: 'Broker',
          acl: ['BackOffice', 'CRM'],
          type: 'brand_role',
          users: null
        }
      ],
      member_count: 5,
      base_url: 'https://irish.rechat.com'
    },
    name: 'Emil Sedgh\'s Team',
    deleted_at: null,
    training: false,
    brand_type: 'Other',
    type: 'brand',
    offices: [],
    hostnames: null,
    roles: [
      {
        id: '88f28276-9ed1-11e7-8c9b-0242ac110003',
        brand: '88c7100a-9ed1-11e7-8c9b-0242ac110003',
        created_at: 1506000844.07952,
        updated_at: 1506000844.07952,
        deleted_at: null,
        role: 'Agent',
        acl: ['Deals', 'Marketing', 'CRM'],
        type: 'brand_role',
        users: [
          {
            id: 'e9adac7c-9f11-11e7-86af-0242ac110003',
            user: {
              type: 'user',
              username: null,
              first_name: 'Emil',
              last_name: 'Agent',
              email: 'emil+agent@rechat.com',
              phone_number: '+14243828604',
              created_at: 1495029776.62289,
              id: '8725b638-3b09-11e7-b651-0242ac110003',
              address_id: null,
              cover_image_url: '',
              profile_image_url:
                'https://d2dzyv4cb7po1i.cloudfront.net/8725b638-3b09-11e7-b651-0242ac110003/5de57a10-8dc3-11e9-8560-2b72482e66f1.jpg',
              updated_at: 1560793972.2309,
              user_status: 'Active',
              profile_image_thumbnail_url: null,
              cover_image_thumbnail_url: null,
              email_confirmed: true,
              timezone: 'America/Los_Angeles',
              user_type: 'Agent',
              deleted_at: null,
              phone_confirmed: true,
              agent: {
                id: '80fe6220-a26f-11e5-8446-f23c91c841bd',
                email: 'etebari_peyman@yahoo.com',
                mlsid: '0530796',
                fax: null,
                full_name: 'Peyman Etebari',
                first_name: 'Peyman',
                last_name: 'Etebari',
                middle_name: null,
                phone_number: '(972) 989-9701',
                nar_number: '791509740',
                office_mui: 52549046,
                status: 'Active',
                office_mlsid: 'ETEB01',
                work_phone: '(972) 989-9701',
                generational_name: null,
                matrix_unique_id: 15553885,
                updated_at: 1451139644.92396,
                deleted_at: null,
                created_at: 1452542709.26428,
                type: 'agent',
                user_id: '8725b638-3b09-11e7-b651-0242ac110003',
                office_id: '90c4f0e0-b97e-11e5-94c9-f23c91c841bd',
                profile_image_url:
                  'https://d2dzyv4cb7po1i.cloudfront.net/8725b638-3b09-11e7-b651-0242ac110003/5de57a10-8dc3-11e9-8560-2b72482e66f1.jpg',
                cover_image_url: '',
                secret_questions: ['(972) XXX-XX01', 'etebarxxxxxxxxxxxxoo.com']
              },
              is_shadow: false,
              personal_room: '87277932-3b09-11e7-b651-0242ac110003',
              brand: '88c7100a-9ed1-11e7-8c9b-0242ac110003',
              fake_email: false,
              features: ['Deals'],
              last_seen_at: 1561209127.564,
              email_signature: null,
              current_time: '6:37 AM - Saturday Jun 22, 2019',
              push_allowed: false,
              last_seen_type: 'Web',
              has_docusign: true,
              active_brand: '88c7100a-9ed1-11e7-8c9b-0242ac110003',
              display_name: 'Emil Agent',
              abbreviated_display_name: 'Emil',
              online_state: 'Online'
            },
            role: '88f28276-9ed1-11e7-8c9b-0242ac110003',
            deleted_at: null,
            type: 'brand_user'
          },
          {
            id: '46b8d50c-d95c-11e7-96c4-0242ac11000d',
            user: {
              type: 'user',
              username: null,
              first_name: 'Emil',
              last_name: 'Agent Two',
              email: 'emil+agent+2@rechat.com',
              phone_number: null,
              created_at: 1512437600.3552,
              id: '46a5929e-d95c-11e7-96c4-0242ac11000d',
              address_id: null,
              cover_image_url: null,
              profile_image_url: null,
              updated_at: 1512437679.00056,
              user_status: 'Active',
              profile_image_thumbnail_url: null,
              cover_image_thumbnail_url: null,
              email_confirmed: true,
              timezone: 'America/Chicago',
              user_type: 'Agent',
              deleted_at: null,
              phone_confirmed: false,
              agent: {
                id: '6f5b5fc6-d95b-11e7-88a9-0242ac11000d',
                email: 'emil+agent+2@rechat.com',
                mlsid: '998711032',
                fax: null,
                full_name: 'Emil Second Agent',
                first_name: 'Emil',
                last_name: 'Agent',
                middle_name: '',
                phone_number: '(999) 999-9999',
                nar_number: '',
                office_mui: 9999999,
                status: 'Active',
                office_mlsid: 'RCHT01',
                work_phone: '(999) 999-9999',
                generational_name: null,
                matrix_unique_id: 998711032,
                updated_at: 1512437239.16002,
                deleted_at: null,
                created_at: 1512437239.16002,
                type: 'agent',
                user_id: '12468da0-54b2-11e9-97e2-0a95998482ac',
                office_id: 'b8b6d6cc-6166-11e7-bbc4-0242ac110003',
                profile_image_url: null,
                cover_image_url: null,
                secret_questions: ['(999) XXX-XX99', 'emil+xxxxxxxxxxxxxt.com']
              },
              is_shadow: false,
              personal_room: '46a9001e-d95c-11e7-96c4-0242ac11000d',
              brand: '88c7100a-9ed1-11e7-8c9b-0242ac110003',
              fake_email: false,
              features: null,
              last_seen_at: 1512787437.934,
              email_signature: null,
              current_time: '8:37 AM - Saturday Jun 22, 2019',
              push_allowed: true,
              last_seen_type: 'Web',
              has_docusign: true,
              active_brand: '88c7100a-9ed1-11e7-8c9b-0242ac110003',
              display_name: 'Emil Agent Two',
              abbreviated_display_name: 'Emil',
              online_state: 'Offline'
            },
            role: '88f28276-9ed1-11e7-8c9b-0242ac110003',
            deleted_at: null,
            type: 'brand_user'
          },
          {
            id: 'c0957a86-0a9b-11e8-97f6-0ae785638eb4',
            user: {
              type: 'user',
              username: null,
              first_name: 'Trey',
              last_name: 'Jones',
              email: 'trey+agent@rechat.com',
              phone_number: '+12149308868',
              created_at: 1506609330.39858,
              id: '470ab91c-a45a-11e7-a3aa-0242ac110003',
              address_id: null,
              cover_image_url: null,
              profile_image_url:
                'https://d2dzyv4cb7po1i.cloudfront.net/470ab91c-a45a-11e7-a3aa-0242ac110003/23c40140-f191-11e8-a154-9d182aa56990.jpg',
              updated_at: 1560631584.24023,
              user_status: 'Active',
              profile_image_thumbnail_url: null,
              cover_image_thumbnail_url: null,
              email_confirmed: true,
              timezone: 'America/Chicago',
              user_type: 'Agent',
              deleted_at: 1521120405.96744,
              phone_confirmed: true,
              agent: {
                id: 'efc5dec0-83f0-11e9-824a-0a95998482ac',
                email: 'trey+agent@rechat.com',
                mlsid: '12981298',
                fax: null,
                full_name: 'Trey Jones',
                first_name: 'Trey',
                last_name: 'Jones',
                middle_name: '',
                phone_number: '(999) 999-9999',
                nar_number: '',
                office_mui: 9999999,
                status: 'Active',
                office_mlsid: 'RCHT01',
                work_phone: '(999) 999-9999',
                generational_name: null,
                matrix_unique_id: 123459876,
                updated_at: 1559340644.96229,
                deleted_at: null,
                created_at: 1559340644.96229,
                type: 'agent',
                user_id: '470ab91c-a45a-11e7-a3aa-0242ac110003',
                office_id: 'b8b6d6cc-6166-11e7-bbc4-0242ac110003',
                profile_image_url:
                  'https://d2dzyv4cb7po1i.cloudfront.net/470ab91c-a45a-11e7-a3aa-0242ac110003/23c40140-f191-11e8-a154-9d182aa56990.jpg',
                cover_image_url: null,
                secret_questions: ['(999) XXX-XX99', 'trey+xxxxxxxxxxxt.com']
              },
              is_shadow: false,
              personal_room: '4711c2ca-a45a-11e7-a3aa-0242ac110003',
              brand: '1f455f54-a45a-11e7-aa39-0242ac110003',
              fake_email: false,
              features: ['Deals'],
              last_seen_at: 1560982642.784,
              email_signature: null,
              current_time: '8:37 AM - Saturday Jun 22, 2019',
              push_allowed: true,
              last_seen_type: 'Web',
              has_docusign: true,
              active_brand: '1f455f54-a45a-11e7-aa39-0242ac110003',
              display_name: 'Trey Jones',
              abbreviated_display_name: 'Trey',
              online_state: 'Offline'
            },
            role: '88f28276-9ed1-11e7-8c9b-0242ac110003',
            deleted_at: null,
            type: 'brand_user'
          },
          {
            id: '9d4dfd5e-ef5c-11e8-9ebd-0a95998482ac',
            user: {
              type: 'user',
              username: null,
              first_name: 'Shayan',
              last_name: 'Hamidi',
              email: 'shayan.hamidi@gmail.com',
              phone_number: '+19729711191',
              created_at: 1442435000.4841,
              id: 'c5d7d53e-5cb0-11e5-a1b3-f23c91c841bd',
              address_id: null,
              cover_image_url: null,
              profile_image_url:
                'https://d1597zt2cikq9u.cloudfront.net/1f4c27a0-655c-11e6-a404-e35d7c6c59a2.jpg',
              updated_at: 1539008964.58471,
              user_status: 'Active',
              profile_image_thumbnail_url: null,
              cover_image_thumbnail_url: null,
              email_confirmed: true,
              timezone: 'America/Chicago',
              user_type: 'Agent',
              deleted_at: null,
              phone_confirmed: true,
              agent: null,
              is_shadow: false,
              personal_room: '11f02da2-31a1-11e6-8e3a-f23c91b0d077',
              brand: '8cb4a358-8973-11e7-9089-0242ac110003',
              fake_email: false,
              features: [],
              last_seen_at: 1550262250.908,
              email_signature: null,
              current_time: '8:37 AM - Saturday Jun 22, 2019',
              push_allowed: true,
              last_seen_type: 'Web',
              has_docusign: true,
              active_brand: '88c7100a-9ed1-11e7-8c9b-0242ac110003',
              display_name: 'Shayan Hamidi',
              abbreviated_display_name: 'Shayan',
              online_state: 'Offline'
            },
            role: '88f28276-9ed1-11e7-8c9b-0242ac110003',
            deleted_at: null,
            type: 'brand_user'
          }
        ]
      }
    ],
    member_count: 4,
    base_url: 'https://irish.rechat.com'
  }
]
