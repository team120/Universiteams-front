// Run every test in the users' time zone (UTC-3), so date bugs that only show
// west of UTC fail on any machine, including CI (which runs in UTC)
module.exports = async () => {
  process.env.TZ = 'America/Argentina/Buenos_Aires'
}
