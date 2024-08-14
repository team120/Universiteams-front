import Facility from './Facility/Facility'

interface ResearchDepartment {
  id: number
  name: string
  abbreviation: string
  facility: Facility
}

export default ResearchDepartment
