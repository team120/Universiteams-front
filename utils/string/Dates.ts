//////////// DATE TOOLS ////////////

// Get current date & time with a filename-friendly format
const getDateTimeShort = () => {
  return new Date().toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0]
}

// Formats the API's dates, which are date-only (e.g. "2026-10-22"). They are
// parsed as UTC midnight, so they are formatted in UTC too: in local time
// they would show the day before west of UTC (e.g. in Argentina)
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString(undefined, { timeZone: 'UTC' })
}

const Dates = { getDateTimeShort, formatDate }
export default Dates
