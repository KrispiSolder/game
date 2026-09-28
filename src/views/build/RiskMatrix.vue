<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { riskPool } from '@/data/risks'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const store = useProjectStore()

// Матрица 3x3: строки — вероятность, столбцы — влияние
const rows = [
  { prob: 3, label: 'Высокая вероятность' },
  { prob: 2, label: 'Средняя вероятность' },
  { prob: 1, label: 'Низкая вероятность' },
]
const cols = [
  { impact: 1, label: 'Низкое' },
  { impact: 2, label: 'Среднее' },
  { impact: 3, label: 'Высокое' },
]

// Сетка ячеек: ключ `${prob}-${impact}`
const cells = ref({})
for (const r of rows) {
  for (const c of cols) {
    cells.value[`${r.prob}-${c.impact}`] = []
  }
}

const pool = ref([...riskPool])

function cellKey(prob, impact) { return `${prob}-${impact}` }

const placedCount = computed(() =>
  Object.values(cells.value).flat().length
)

function bgFor(prob, impact) {
  const score = prob * impact
  if (score >= 6) return 'bg-danger/20 border-danger/50'
  if (score >= 3) return 'bg-warn/20 border-warn/50'
  return 'bg-success/20 border-success/50'
}

function checkAndFinish() {
  // Сверяем с правильными позициями
  let correct = 0
  let total = 0
  for (const [key, arr] of Object.entries(cells.value)) {
    for (const risk of arr) {
      total++
      const [p, i] = key.split('-').map(Number)
      const right = risk.correct
      if (right.prob === p && right.impact === i) correct++
    }
  }
  store.risks = Object.entries(cells.value).flatMap(([key, arr]) => {
    const [p, i] = key.split('-').map(Number)
    return arr.map(r => ({ ...r, prob: p, impact: i }))
  })
  store._riskScore = total ? Math.round((correct / total) * 100) : 0
  store.buildPassport()
  router.push({ name: 'day-board' })
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <div class="mb-8">
      <div class="text-slate-500 text-sm mb-1">Этап 4 из 4</div>
      <h1 class="text-3xl font-extrabold">Оцени риски</h1>
      <p class="text-slate-400">
        Перетащи каждый риск в ячейку «вероятность × влияние». Осталось: 
        <span class="text-brand-500 font-bold">{{ pool.length }}</span>
      </p>
    </div>

    <!-- Пул рисков -->
    <div class="card mb-6">
      <div class="font-bold mb-3">🎴 Пул рисков</div>
      <draggable
        v-model="pool"
        group="{ name: 'risks', put: true }"
        item-key="id"
        class="flex flex-wrap gap-2 min-h-[60px]"
      >
        <template #item="{ element }">
          <div class="bg-slate-800 rounded-lg px-3 py-2 text-xs cursor-grab active:cursor-grabbing max-w-[260px]">
            {{ element.text }}
          </div>
        </template>
      </draggable>
    </div>

    <!-- Матрица -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="p-2 text-xs text-slate-500 text-left">Вероятность ↓ / Влияние →</th>
            <th v-for="c in cols" :key="c.impact" class="p-2 text-xs text-slate-400">{{ c.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.prob">
            <td class="p-2 text-xs text-slate-400 w-40">{{ r.label }}</td>
            <td
              v-for="c in cols" :key="c.impact"
              class="p-2 align-top border rounded-lg min-w-[180px] h-32"
              :class="bgFor(r.prob, c.impact)"
            >
              <draggable
                v-model="cells[cellKey(r.prob, c.impact)]"
                group="risks"
                item-key="id"
                class="space-y-1 min-h-[60px]"
              >
                <template #item="{ element }">
                  <div class="bg-slate-900/80 rounded px-2 py-1 text-xs cursor-grab">
                    {{ element.text }}
                  </div>
                </template>
              </draggable>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-8 flex justify-between items-center">
      <button @click="router.back()" class="btn-ghost">← Назад</button>
      <button
        @click="checkAndFinish"
        :disabled="placedCount < riskPool.length"
        class="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
      >
        🚀 Запустить проект
      </button>
    </div>
  </div>
</template>