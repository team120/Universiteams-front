//////////// DATE TOOLS ////////////

// A simple date formatter function to format the date strings
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const Dates = { formatDate }
export default Dates
