const Job = require('../model/Job')
const Profile = require('../model/Profile')
const JobUtils = require('../utils/jobUtils')

module.exports = {
  async index(req, res) {

    const jobs = await Job.get(); // get jobs data
    const profile = await Profile.get(); // get profile data

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length
    }

    // total de horas por dia de cada Job em progresso
    let jobTotalHours = 0

    const updatedJobs = jobs.map((job) => {
      const remaining = JobUtils.remainingDays(job)
      const status = remaining <= 0 ? 'done' : 'progress'

      // incrementa a quantidade de status
      statusCount[status] += 1

      // total de horas por dia de cada Job em progresso
      jobTotalHours = status === 'progress' ? Number(job['daily-hours']) : jobTotalHours
     
      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile['value-hour'])
      }
    })

    // qtd de horas que quero trabalhar por dia (PROFILE)
    // MENOS
    // qtd de horas/dia de cada job em progress
    const freeHours = profile['hours-per-day'] - jobTotalHours

    return res.render('index', { jobs: updatedJobs, profile: profile, status: statusCount, freeHours: freeHours })
  },
}
