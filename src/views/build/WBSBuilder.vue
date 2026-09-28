<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { taskPool, stages } from '@/data/tasks'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const store = useProjectStore()

// Разложим задачи по колонкам
const columns = ref(
  stages.map(s => ({
    ...s,
    tasks: taskPool.filter(t => t.stage === s.id),
  }))
)

// Задачи, которые ещё не разложены (пул)
const pool = ref([])

function pickFromColumn(stageId, taskId) {
  const col = columns.value.find(c => c.id === stageId)
  const idx = col.tasks.findIndex(t => t.id === taskId)
  if (idx !== -1) {
    const [task] = col.tasks.splice(idx, 1)
    pool.value.push(task)
  }
}

const allPlaced = computed(() =>
  columns.value.every(c => c.tasks.length > 0)
)

// Общая длительность проекта (упрощённо: сумма дней / кол-во людей в команде)
const totalDays = computed(() => {
  const total = columns.value.flatMap(c => c.tasks).reduce((s, t) => s + t.days, 0)
  const teamSize = Math.max(1, store.team.length)
  return Math.max(20, Math.round(total / teamSize) + 10)
})

function next() {
  store.wbs = columns.value.flatMap(c => c.tasks)
  store.plannedDuration = totalDays.value
  router.push({ name: 'risk-matrix' })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <div class="mb-8">
      <div class="text-slate-500 text-sm mb-1">Этап 3 из 4</div>
      <h1 class="text-3xl font-extrabold">Построй WBS</h1>
      <p class="text-slate-400">
        Разложи задачи по этапам жизненного цикла. Ориентировочная длительность: 
        <span class="text-brand-500 font-bold">{{ totalDays }} дней</span>
      </p>
    </div>

    <!-- Колонки этапов -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
      <div v-for="col in columns" :key="col.id" class="card min-h-[220px]">
        <div class="font-bold mb-3 flex items-center gap-2">
          <span>{{ col.emoji }}</span>
          <span>{{ col.title }}</span>
          <span class="text-xs text-slate-500">({{ col.tasks.length }})</span>
        </div>

        <draggable
          v-model="col.tasks"
          group="tasks"
          item-key="id"
          class="space-y-2 min-h-[60px]"
          ghost-class="opacity-40"
        >
          <template #item="{ element }">
            <div class="bg-slate-800 rounded-lg p-2 text-xs cursor-grab active:cursor-grabbing">
              <div class="font-medium">{{ element.text }}</div>
              <div class="text-slate-500 mt-1">{{ element.days }} дн.</div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Пул (необязательно, но полезно для наглядности) -->
    <div v-if="!allPlaced" class="text-warn text-sm mb-4">
      ⚠️ Некоторые этапы пусты — распредели задачи.
    </div>

    <div class="flex justify-between">
      <button @click="router.back()" class="btn-ghost">← Назад</button>
      <button
        @click="next"
        :disabled="!allPlaced"
        class="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Дальше → Риски
      </button>
    </div>
  </div>
</template>