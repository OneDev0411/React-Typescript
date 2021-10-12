declare interface ISchoolsDistrict {
  label: string
  value: string
}

declare interface ISchool {
  name: string
  type: SchoolType
}

declare type SchoolType =
  | 'junior_high_school'
  | 'elementary_school'
  | 'high_school'
  | 'middle_school'
  | 'intermediate_school'
  | 'senior_high_school'
  | 'primary_school'
