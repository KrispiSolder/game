<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { taskPool, stages } from '@/data/tasks'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const store = useProjectStore()

// Колонки этапов — изначально пустые
const columns = ref(
  stages.map(s => ({
    ...s,
    tasks: [],
  }))
)

// Пул задач — все задачи вперемешку
const pool = ref([])

onMounted(() => {
  // Перемешиваем задачи (Fisher–Yates)
  const shuffled = [...taskPool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  pool.value = shuffled
})

// Общее число разложенных задач
const placedCount = computed(() =>
  columns.value.reduce((sum, c) => sum + c.tasks.length, 0)
)

// Все ли задачи разложены
const allPlaced = computed(() => pool.value.length === 0)

// Ориентировочная длительность — считается только когда всё разложено
const totalDays = computed(() => {
  if (!allPlaced.value) return null
  const total = columns.value.flatMap(c => c.tasks).reduce((s, t) => s + t.days, 0)
  const teamSize = Math.max(1, store.team.length)
  return Math.max(20, Math.round(total / teamSize) + 10)
})

// Сколько задач положили неправильно
const mistakes = computed(() => {
  let wrong = 0
  for (const col of columns.value) {
    for (const task of col.tasks) {
      if (task.stage !== col.id) wrong++
    }
  }
  return wrong
})

function next() {
  if (!allPlaced.value) return
  store.wbs = columns.value.flatMap(c => c.tasks)
  store.plannedDuration = totalDays.value
  store.wbsMistakes = mistakes.value
  router.push({ name: 'risk-matrix' })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <div class="mb-8">
      <div class="text-slate-500 text-sm mb-1">Этап 3 из 4</div>
      <h1 class="text-3xl font-extrabold">Построй WBS</h1>
      <p class="text-slate-400">
        Разложи задачи по этапам жизненного цикла. Перетаскивай карточки из пула внизу.
        <span v-if="totalDays" class="text-brand-500 font-bold">
          Ориентировочная длительность: {{ totalDays }} дней
        </span>
      </p>
    </div>

    <!-- Колонки этапов -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
      <div v-for="col in columns" :key="col.id" class="card min-h-[260px]">
        <div class="font-bold mb-3 flex items-center gap-2">
          <span>{{ col.emoji }}</span>
          <span>{{ col.title }}</span>
        </div>

        <draggable
          v-model="col.tasks"
          group="tasks"
          item-key="id"
          class="space-y-2 min-h-[120px]"
          ghost-class="opacity-40"
        >
          <template #item="{ element }">
            <div class="bg-slate-800 rounded-lg p-2 text-xs cursor-grab active:cursor-grabbing">
              <div class="font-medium">{{ element.text }}</div>
              <div class="text-slate-500 mt-1">{{ element.days }} дн.</div>
            </div>
          </template>
        </draggable>

        <div v-if="!col.tasks.length" class="text-slate-600 text-xs italic text-center py-6">
          Перетащи задачи сюда
        </div>
      </div>
    </div>

    <!-- Пул задач -->
    <div class="card mb-6">
      <div class="font-bold mb-3 flex items-center justify-between">
        <span>🎴 Пул задач</span>
        <span class="text-xs text-slate-500">
          Осталось разложить: {{ pool.length }}
        </span>
      </div>

      <draggable
        v-model="pool"
        group="tasks"
        item-key="id"
        class="flex flex-wrap gap-2 min-h-[80px]"
        ghost-class="opacity-40"
      >
        <template #item="{ element }">
          <div class="bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 text-xs cursor-grab active:cursor-grabbing max-w-[220px] transition">
            <div class="font-medium">{{ element.text }}</div>
            <div class="text-slate-500 mt-1">{{ element.days }} дн.</div>
          </div>
        </template>
      </draggable>

      <div v-if="!pool.length" class="text-success text-xs text-center py-4">
        ✅ Все задачи разложены
      </div>
    </div>

    <!-- Предупреждения -->
    <div v-if="!allPlaced" class="text-warn text-sm mb-4">
      ⚠️ Разложи все задачи, чтобы продолжить.
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