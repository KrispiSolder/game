<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cases } from '@/data/cases'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const store = useProjectStore()

const idx = ref(0)
const current = computed(() => cases[idx.value])

// Массивы индексов — Vue отлично отслеживает изменения в массивах
const pickedProblems = ref([])
const pickedGoals = ref([])
const pickedStakeholders = ref([])

function toggleProblem(i) {
  const pos = pickedProblems.value.indexOf(i)
  if (pos === -1) pickedProblems.value.push(i)
  else pickedProblems.value.splice(pos, 1)
}

function toggleStakeholder(i) {
  const pos = pickedStakeholders.value.indexOf(i)
  if (pos === -1) pickedStakeholders.value.push(i)
  else pickedStakeholders.value.splice(pos, 1)
}

function pickGoal(i) {
  pickedGoals.value = [i]
}

// Сброс выбора при смене кейса
function switchCase(i) {
  idx.value = i
  pickedProblems.value = []
  pickedGoals.value = []
  pickedStakeholders.value = []
}

function next() {
  store.caseId = current.value.id
  store.goal = current.value.goals[pickedGoals.value[0]]?.text
  store.stakeholders = pickedStakeholders.value.map(i => current.value.stakeholders[i].text)
  router.push({ name: 'team-pick' })
}

const canNext = computed(() =>
  pickedProblems.value.length >= 1 &&
  pickedGoals.value.length === 1 &&
  pickedStakeholders.value.length >= 2
)
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <div class="mb-8">
      <div class="text-slate-500 text-sm mb-1">Этап 1 из 4</div>
      <h1 class="text-3xl font-extrabold">Инициация проекта</h1>
      <p class="text-slate-400">Выбери проблему, цель по SMART и заинтересованных лиц.</p>
    </div>

    <!-- Переключатель кейсов -->
    <div class="flex flex-wrap gap-3 mb-6">
      <button
        v-for="(c, i) in cases" :key="c.id"
        @click="switchCase(i)"
        class="btn"
        :class="i === idx ? 'bg-brand-600 text-white' : 'btn-ghost'"
      >
        {{ c.emoji }} {{ c.title }}
      </button>
    </div>

    <div class="card mb-6">
      <div class="text-2xl font-bold mb-2">{{ current.emoji }} {{ current.title }}</div>
      <div class="text-slate-400 italic mb-1">«{{ current.tagline }}»</div>
      <div class="text-slate-500 text-sm">Заказчик: {{ current.customer }}</div>
    </div>

    <div class="grid md:grid-cols-3 gap-4">
      <!-- Проблемы -->
      <div class="card">
        <div class="font-bold mb-3 text-danger">🔴 Проблемы (выбери верные)</div>
        <button
          v-for="(p, i) in current.problems" :key="'p'+i"
          @click="toggleProblem(i)"
          class="w-full text-left text-sm py-2 px-3 rounded-lg mb-2 transition"
          :class="pickedProblems.includes(i)
            ? 'bg-brand-600 text-white'
            : 'bg-slate-800 hover:bg-slate-700'"
        >
          {{ p.text }}
        </button>
      </div>

      <!-- Цели -->
      <div class="card">
        <div class="font-bold mb-3 text-success">🎯 Цель (выбери одну)</div>
        <button
          v-for="(g, i) in current.goals" :key="'g'+i"
          @click="pickGoal(i)"
          class="w-full text-left text-sm py-2 px-3 rounded-lg mb-2 transition"
          :class="pickedGoals.includes(i)
            ? 'bg-success text-white'
            : 'bg-slate-800 hover:bg-slate-700'"
        >
          {{ g.text }}
        </button>
      </div>

      <!-- Стейкхолдеры -->
      <div class="card">
        <div class="font-bold mb-3 text-brand-500">👥 Заинтересованные (выбери ≥2)</div>
        <button
          v-for="(s, i) in current.stakeholders" :key="'s'+i"
          @click="toggleStakeholder(i)"
          class="w-full text-left text-sm py-2 px-3 rounded-lg mb-2 transition"
          :class="pickedStakeholders.includes(i)
            ? 'bg-brand-600 text-white'
            : 'bg-slate-800 hover:bg-slate-700'"
        >
          {{ s.text }}
        </button>
      </div>
    </div>

    <div class="mt-8 flex justify-end">
      <button
        @click="next"
        :disabled="!canNext"
        class="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Дальше → Команда
      </button>
    </div>
  </div>
</template>