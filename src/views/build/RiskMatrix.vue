<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { riskPool } from '@/data/risks'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const store = useProjectStore()

const probs = [
  { value: 3, label: 'Высокая' },
  { value: 2, label: 'Средняя' },
  { value: 1, label: 'Низкая' },
]
const impacts = [
  { value: 1, label: 'Низкое' },
  { value: 2, label: 'Среднее' },
  { value: 3, label: 'Высокое' },
]

// Плоский массив из 9 ячеек — так vuedraggable работает надёжно
const cells = ref(
  probs.flatMap(p =>
    impacts.map(i => ({
      id: `${p.value}-${i.value}`,
      prob: p.value,
      impact: i.value,
      tasks: [],
    }))
  )
)

const pool = ref([...riskPool])

function cellById(id) {
  return cells.value.find(c => c.id === id)
}

const placedCount = computed(() =>
  cells.value.reduce((sum, c) => sum + c.tasks.length, 0)
)

const allPlaced = computed(() => pool.value.length === 0)

function bgFor(prob, impact) {
  const score = prob * impact
  if (score >= 6) return 'bg-danger/20 border-danger/50'
  if (score >= 3) return 'bg-warn/20 border-warn/50'
  return 'bg-success/20 border-success/50'
}

function finish() {
  if (!allPlaced.value) return
  // Собираем риски с их позициями
  store.risks = cells.value.flatMap(c =>
    c.tasks.map(t => ({ ...t, prob: c.prob, impact: c.impact }))
  )
  // Считаем правильность
  let correct = 0
  for (const c of cells.value) {
    for (const t of c.tasks) {
      if (t.correct.prob === c.prob && t.correct.impact === c.impact) correct++
    }
  }
  store._riskScore = store.risks.length
    ? Math.round((correct / store.risks.length) * 100)
    : 0
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
        Перетащи каждый риск в ячейку «вероятность × влияние».
        Осталось: <span class="text-brand-500 font-bold">{{ pool.length }}</span>
      </p>
    </div>

    <!-- Пул рисков -->
    <div class="card mb-6">
      <div class="font-bold mb-3">🎴 Пул рисков</div>
      <draggable
        v-model="pool"
        group="risks"
        item-key="id"
        class="flex flex-wrap gap-2 min-h-[80px]"
        ghost-class="opacity-40"
      >
        <template #item="{ element }">
          <div class="bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 text-xs cursor-grab active:cursor-grabbing max-w-[260px] transition">
            {{ element.text }}
          </div>
        </template>
      </draggable>
      <div v-if="!pool.length" class="text-success text-xs text-center py-3">
        ✅ Все риски распределены
      </div>
    </div>

    <!-- Матрица -->
    <div class="card overflow-x-auto">
      <!-- Заголовок «Влияние →» -->
      <div class="flex items-center mb-2 min-w-[640px]">
        <div class="w-40"></div>
        <div class="flex-1 text-center text-xs text-slate-400 font-semibold">
          Влияние →
        </div>
      </div>

      <!-- Заголовки колонок -->
      <div class="flex mb-2 min-w-[640px]">
        <div class="w-40 flex items-end justify-end pr-3 text-xs text-slate-500">
          Вероятность ↓
        </div>
        <div
          v-for="i in impacts" :key="i.value"
          class="flex-1 text-center text-xs text-slate-400 font-semibold py-1"
        >
          {{ i.label }}
        </div>
      </div>

      <!-- Строки -->
      <div
        v-for="p in probs" :key="p.value"
        class="flex mb-2 min-w-[640px]"
      >
        <div class="w-40 flex items-center justify-end pr-3 text-xs text-slate-400 font-semibold">
          {{ p.label }}
        </div>

        <div
          v-for="i in impacts" :key="i.value"
          class="flex-1 mx-1 rounded-lg border min-h-[130px] p-2"
          :class="bgFor(p.value, i.value)"
        >
          <draggable
            v-model="cellById(`${p.value}-${i.value}`).tasks"
            group="risks"
            item-key="id"
            class="space-y-1 min-h-[60px]"
            ghost-class="opacity-40"
          >
            <template #item="{ element }">
              <div class="bg-slate-900/80 hover:bg-slate-900 rounded px-2 py-1 text-xs cursor-grab active:cursor-grabbing">
                {{ element.text }}
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between items-center">
      <button @click="router.back()" class="btn-ghost">← Назад</button>
      <button
        @click="finish"
        :disabled="!allPlaced"
        class="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
      >
        🚀 Запустить проект
      </button>
    </div>
  </div>
</template>