import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => ({
    // --- Режим 1: паспорт проекта ---
    caseId: null,
    goal: null,
    stakeholders: [],
    team: [],
    wbs: [],
    risks: [],
    wbsMistakes: 0,
    _riskScore: 0,
    budget: 0,
    plannedDuration: 0,
    passportReady: false,

    // --- Режим 2: состояние симуляции ---
    day: 1,
    spent: 0,
    morale: 100,
    doneTasks: [],          // id выполненных задач
    inProgress: {},         // { taskId: daysLeft }
    activeRisks: [],        // риски, которые сработали и ещё действуют
    triggeredRisks: [],     // id рисков, которые уже сработали
    eventLog: [],
    finished: false,
    success: false,
    failureReason: null,
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
          wbsMistakes: s.wbsMistakes,
          riskScore: s._riskScore,
        }
      : null,

    /** Средняя скорость команды в задачах за день */
    teamSpeed: (s) => {
      if (!s.team.length) return 1
      // morale — множитель: 100% → 1.0, 30% → 0.3, ниже 20% → сильный штраф
      const moraleFactor =
        s.morale >= 80 ? 1
        : s.morale >= 50 ? 0.7
        : s.morale >= 30 ? 0.5
        : s.morale >= 10 ? 0.25
        : 0.1
      const base = s.team.reduce((sum, m) => sum + m.speed, 0) / 3
      return Math.max(0.2, base * moraleFactor)
    },

    /** Сколько денег тратится за день (зарплаты) */
    dailyCost: (s) =>
      s.team.reduce((sum, m) => sum + m.cost, 0) / 5,

    /** Доля выполненных задач */
    progress: (s) =>
      s.wbs.length
        ? Math.round((s.doneTasks.length / s.wbs.length) * 100)
        : 0,

    /** Осталось дней по плану */
    daysLeft: (s) => Math.max(0, s.plannedDuration - s.day),
  },

  actions: {
    reset() {
      this.$reset()
    },

    buildPassport() {
      const teamCost = this.team.reduce((s, m) => s + m.cost, 0)
      this.budget = teamCost * 15 + 50000

      // Базовая оценка: сумма дней / скорость команды
      const totalDays = this.wbs.reduce((s, t) => s + t.days, 0)
      const speed = this.team.reduce((s, m) => s + m.speed, 0) / 3
      this.plannedDuration = Math.max(
        20,
        Math.round(totalDays / Math.max(1, speed))
      )
      this.passportReady = true
    },

    /** Выполнить одну задачу за день (простая модель) */
    workOneDay() {
      // Списываем зарплаты
      this.spent += this.dailyCost
      this.day++

      // Сколько задач можем сделать за этот день
      const tasksToday = Math.max(1, Math.round(this.teamSpeed))

      for (let k = 0; k < tasksToday; k++) {
        const nextTask = this.wbs.find(t => !this.doneTasks.includes(t.id))
        if (!nextTask) break
        this.doneTasks.push(nextTask.id)
      }

      // Мораль падает от переработки
      if (this.day > this.plannedDuration * 0.7) {
        this.morale = Math.max(0, this.morale - 5)
      }

      this.checkEndConditions()
    },

    checkEndConditions() {
      // Победа — все задачи сделаны и уложились в бюджет и срок
      if (this.doneTasks.length >= this.wbs.length) {
        this.finished = true
        this.success =
          this.spent <= this.budget * 1.1 &&
          this.day <= this.plannedDuration * 1.1
        if (!this.success) {
          this.failureReason =
            this.spent > this.budget
              ? 'Превышен бюджет'
              : 'Превышен срок'
        }
        return
      }

      // Провал по срокам (сильное превышение)
      if (this.day > this.plannedDuration * 1.5) {
        this.finished = true
        this.success = false
        this.failureReason = 'Проект сильно отстал от графика'
        return
      }

      // Провал по бюджету
      if (this.spent > this.budget * 1.5) {
        this.finished = true
        this.success = false
        this.failureReason = 'Бюджет исчерпан'
        return
      }

      // Провал по морали
      if (this.morale <= 0) {
        this.finished = true
        this.success = false
        this.failureReason = 'Команда разбежалась'
        return
      }
    },

    /** Применить эффект события */
    applyEffect(effect) {
      if (!effect) return
      if (effect.budget) this.spent -= effect.budget   // отрицательный = трата
      if (effect.morale) this.morale = Math.max(0, Math.min(100, this.morale + effect.morale))
      if (effect.delay) this.day += effect.delay
      if (effect.risk) this.activeRisks.push(effect.risk)
      this.checkEndConditions()
    },
  },
})