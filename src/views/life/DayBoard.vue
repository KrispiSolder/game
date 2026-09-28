<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { events } from '@/data/events'
import HUD from '@/components/HUD.vue'
import EventModal from '@/components/EventModal.vue'

const router = useRouter()
const store = useProjectStore()

const currentEvent = ref(null)
const selectedTask = ref(null)
const log = ref([])

// Задачи, ещё не выполненные
const remaining = computed(() =>
  store.wbs.filter(t => !store.doneTasks.includes(t.id))
)

// Средняя скорость команды
const teamSpeed = computed(() =>
  store.team.reduce((s, m) => s + m.speed, 0)
)

onMounted(() => {
  if (!store.passport) router.push('/')
})

function assignTask(memberId) {
  if (!selectedTask.value) return
  const task = remaining.value.find(t => t.id === selectedTask.value)
  if (!task) return

  // Простая модель: тратим 1 день, выполняем 1 задачу
  store.doneTasks.push(task.id)
  store.spent += 5000
  log.value.push(`✅ День ${store.day}: выполнено «${task.text}»`)
  selectedTask.value = null
}

function nextDay() {
  store.day++

  // Случайное событие
  const pool = events.filter(e =>
    e.trigger === 'any' || e.trigger === currentStage()
  )
  const evt = pool[Math.floor(Math.random() * pool.length)]
  if (evt && Math.random() < 0.5) {
    currentEvent.value = evt
  }

  // Проверка условий завершения
  if (store.doneTasks.length >= store.wbs.length) {
    store.finished = true
    store.success = store.spent <= store.budget * 1.2
    router.push({ name: 'final-report' })
  }
  if (store.day > store.plannedDuration * 1.5) {
    store.finished = true
    store.success = false
    router.push({ name: 'final-report' })
  }
  if (store.morale <= 0) {
    store.finished = true
    store.success = false
    router.push({ name: 'final-report' })
  }
}

function currentStage() {
  const done = store.doneTasks.length
  if (done < 3) return 'analysis'
  if (done < 6) return 'design'
  if (done < 11) return 'dev'
  if (done < 14) return 'test'
  return 'deploy'
}

function applyChoice(effect) {
  if (!effect) return
  if (effect.budget) store.spent -= effect.budget   // отрицательный = трата
  if (effect.morale) store.morale += effect.morale
  if (effect.delay) store.day += effect.delay
  currentEvent.value = null
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6">
    <HUD :store="store" />

    <div class="grid lg:grid-cols-3 gap-6 mt-6">
      <!-- Задачи -->
      <div class="lg:col-span-2 card">
        <div class="font-bold mb-4 flex items-center justify-between">
          <span>📋 Осталось задач: {{ remaining.length }}</span>
          <span class="text-xs text-slate-500">Выбери задачу и назначь исполнителя</span>
        </div>

        <div class="space-y-2 max-h-[420px] overflow-y-auto">
          <button
            v-for="t in remaining" :key="t.id"
            @click="selectedTask = t.id"
            class="w-full text-left p-3 rounded-lg transition"
            :class="selectedTask === t.id
              ? 'bg-brand-600 text-white'
              : 'bg-slate-800 hover:bg-slate-700'"
          >
            <div class="font-medium">{{ t.text }}</div>
            <div class="text-xs opacity-70">{{ t.days }} дн. · {{ t.stage }}</div>
          </button>
        </div>

        <!-- Команда -->
        <div class="mt-6">
          <div class="font-bold mb-3 text-sm text-slate-400">👥 Назначить исполнителя</div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="m in store.team" :key="m.id"
              @click="assignTask(m.id)"
              :disabled="!selectedTask"
              class="btn bg-slate-800 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              {{ m.emoji }} {{ m.name }}
            </button>
          </div>
        </div>

        <button @click="nextDay" class="btn-primary mt-6 w-full">
          ⏭ Следующий день
        </button>
      </div>

      <!-- Лог -->
      <div class="card">
        <div class="font-bold mb-3">📜 Журнал событий</div>
        <div class="text-xs space-y-1 max-h-[500px] overflow-y-auto text-slate-400">
          <div v-for="(l, i) in log" :key="i">{{ l }}</div>
          <div v-if="!log.length" class="italic">Пока пусто. Начни работать!</div>
        </div>
      </div>
    </div>

    <EventModal
      v-if="currentEvent"
      :event="currentEvent"
      @choice="applyChoice"
      @close="currentEvent = null"
    />
  </div>
</template>