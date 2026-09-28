import { createRouter, createWebHashHistory } from 'vue-router'

import MainMenu from '@/views/MainMenu.vue'

import CaseSelect from '@/views/build/CaseSelect.vue'
import TeamPick from '@/views/build/TeamPick.vue'
import WBSBuilder from '@/views/build/WBSBuilder.vue'
import RiskMatrix from '@/views/build/RiskMatrix.vue'

import DayBoard from '@/views/life/DayBoard.vue'
import FinalReport from '@/views/life/FinalReport.vue'

const routes = [
  { path: '/', name: 'menu', component: MainMenu },

  { path: '/build/case',     name: 'case-select',  component: CaseSelect },
  { path: '/build/team',     name: 'team-pick',    component: TeamPick },
  { path: '/build/wbs',      name: 'wbs-builder',  component: WBSBuilder },
  { path: '/build/risks',    name: 'risk-matrix',  component: RiskMatrix },

  { path: '/life/day',       name: 'day-board',    component: DayBoard },
  { path: '/life/report',    name: 'final-report', component: FinalReport },
]

export default createRouter({
  history: createWebHashHistory(),   // важно для GitHub Pages без настройки 404
  routes,
  scrollBehavior: () => ({ top: 0 }),
})