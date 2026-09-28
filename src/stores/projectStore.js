import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => ({
    caseId: null,
    goal: null,
    stakeholders: [],
    team: [],
    wbs: [],
    risks: [],
    budget: 0,
    plannedDuration: 0,
    passportReady: false,

    // состояние второго режима
    day: 1,
    spent: 0,
    doneTasks: [],
    morale: 100,
    activeRisks: [],
    eventLog: [],
    finished: false,
    success: false,
  }),

  getters: {
    passport: (s) => s.passportReady
      ? {
          caseId: s.caseId,
          goal: s.goal,
          stakeholders: s.stakeholders,
          team: s.team,
          wbs: s.wbs,
          risks: s.risks,
          budget: s.budget,
          plannedDuration: s.plannedDuration,
        }
      : null,

    totalTasks: (s) => s.wbs.length,
    progress: (s) => s.wbs.length
      ? Math.round((s.doneTasks.length / s.wbs.length) * 100)
      : 0,
  },

  actions: {
    reset() {
      this.$reset()
    },

    buildPassport() {
      // бюджет = сумма команды + фикс
      const teamCost = this.team.reduce((sum, m) => sum + m.cost, 0)
      this.budget = teamCost * 15 + 50000   // грубая эвристика
      // длительность = сумма дней задач / кол-во команды
      const totalDays = this.wbs.reduce((s, t) => s + t.days, 0)
      this.plannedDuration = Math.max(30, Math.round(totalDays / Math.max(1, this.team.length)) * 2)
      this.passportReady = true
    },
  },
})