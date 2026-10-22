import Dates from 'utils/string/Dates'

describe('Dates.formatDate', () => {
  it.each(['2026-10-22', '2026-10-22T00:00:00.000Z'])(
    'should keep the calendar day of %s in any time zone',
    (date) => {
      // Argentina is UTC-3, where local time would show October 21
      const expected = new Date(Date.UTC(2026, 9, 22)).toLocaleDateString(undefined, {
        timeZone: 'UTC',
      })
      const argentina = new Date(date).toLocaleDateString(undefined, {
        timeZone: 'America/Argentina/Buenos_Aires',
      })

      expect(Dates.formatDate(date)).toBe(expected)
      expect(Dates.formatDate(date)).not.toBe(argentina)
    }
  )

  it('should show N/A when there is no date', () => {
    expect(Dates.formatDate(undefined)).toBe('N/A')
  })
})
