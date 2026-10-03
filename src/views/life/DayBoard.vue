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
const recentLog = ref([])

onMounted(() => {
  if (!store.passport) router.push('/')
  log(`🎬 День 1. Проект стартовал. Команда: ${store.team.length} чел.`)
})

function log(text) {
  recentLog.value.unshift(text)
  store.eventLog.push(text)
  if (recentLog.value.length > 15) recentLog.value.pop()
}

/** Определяем текущий этап по числу выполненных задач */
function currentStage() {
  const done = store.doneTasks.length
  const total = store.wbs.length
  const ratio = done / total
  if (ratio < 0.2) return 'analysis'
  if (ratio < 0.4) return 'design'
  if (ratio < 0.7) return 'dev'
  if (ratio < 0.9) return 'test'
  return 'deploy'
}

/** Сработавшие риски из матрицы */
function checkRisksForEvent() {
  // Чем выше оценка риска (prob × impact), тем чаще он срабатывает
  const dangerous = store.risks.filter(r => r.prob * r.impact >= 4)
  if (!dangerous.length) return null

  // Шанс 40% на один из опасных рисков
  if (Math.random() > 0.4) return null

  const risk = dangerous[Math.floor(Math.random() * dangerous.length)]
  if (store.triggeredRisks.includes(risk.id)) return null
  store.triggeredRisks.push(risk.id)

  return {
    emoji: '⚠️',
    title: 'Сработал риск!',
    text: risk.text,
    choices: [
      {
        text: 'Реагировать по плану',
        effect: { morale: -5, budget: -10000 },
      },
      {
        text: 'Проигнорировать',
        effect: { morale: -15, delay: 2, risk: risk.id },
      },
    ],
  }
}

/** Выбрать случайное событие с учётом этапа */
function pickEvent() {
  const stage = currentStage()
  const pool = events.filter(
    e => e.trigger === 'any' || e.trigger === stage
  )
  if (!pool.length) return null
  // 50% шанс, что что-то вообще произойдёт
  if (Math.random() > 0.5) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

function nextDay() {
  if (store.finished) return

  // 1) День работы: списываем бюджет, выполняем задачи
  store.workOneDay()
  log(`🛠 День ${store.day}: сделано ${store.doneTasks.length}/${store.wbs.length}, бюджет ${Math.round(store.spent)}/${store.budget} ₽`)

  // 2) Проверяем риски
  const riskEvent = checkRisksForEvent()
  if (riskEvent) {
    currentEvent.value = riskEvent
    return
  }

  // 3) Случайное событие
  const evt = pickEvent()
  if (evt) {
    currentEvent.value = evt
    return
  }

  // 4) Может, проект уже закончился
  if (store.finished) {
    router.push({ name: 'final-report' })
  }
}

function onChoice(effect) {
  store.applyEffect(effect)
  log(`➡️ Решение применено`)
  currentEvent.value = null
  if (store.finished) router.push({ name: 'final-report' })
}

function onCloseEvent() {
  // Событие без выбора — просто применяем его эффект
  if (currentEvent.value?.effects) {
    for (const e of currentEvent.value.effects) {
      store.applyEffect({
        [e.type]: e.value,
      })
    }
  }
  log(`ℹ️ ${currentEvent.value?.title}`)
  currentEvent.value = null
  if (store.finished) router.push({ name: 'final-report' })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6">
    <HUD :store="store" />

    <!-- Прогресс-бар -->
    <div class="card mt-4">
      <div class="flex items-center justify-between mb-2 text-sm">
        <span class="font-bold">Прогресс проекта</span>
        <span class="text-slate-400">{{ store.doneTasks.length }} / {{ store.wbs.length }}</span>
      </div>
      <div class="h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-brand-500 to-success transition-all"
          :style="{ width: store.progress + '%' }"
        />
      </div>
      <div class="mt-2 text-xs text-slate-500">
        Скорость команды: ~{{ store.teamSpeed.toFixed(1) }} задач/день ·
        Расход: ~{{ Math.round(store.dailyCost) }} ₽/день
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6 mt-6">
      <!-- Левая часть: следующий день -->
      <div class="lg:col-span-2 card">
        <div class="font-bold mb-4">📅 Ход проекта</div>

        <div class="space-y-3 text-sm text-slate-300 mb-6">
          <div>Этап: <b>{{ currentStage() }}</b></div>
          <div>Следующий день: <b>{{ store.day + 1 }}</b> / {{ store.plannedDuration }}</div>
          <div v-if="store.doneTasks.length < store.wbs.length">
            Следующая задача:
            <b>{{ store.wbs.find(t => !store.doneTasks.includes(t.id))?.text }}</b>
          </div>
          <div v-else class="text-success font-bold">
            ✅ Все задачи выполнены! Осталось только дождаться финала.
          </div>
        </div>

        <button
          @click="nextDay"
          :disabled="store.finished"
          class="btn-primary w-full disabled:opacity-40"
        >
          ⏭ Прожить день
        </button>

        <div v-if="store.morale < 30" class="mt-3 text-danger text-xs text-center">
          😱 Команда на грани выгорания — сбавь темп!
        </div>
        <div v-if="store.spent > store.budget * 0.8" class="mt-3 text-warn text-xs text-center">
          💸 Бюджет почти исчерпан
        </div>
      </div>

      <!-- Журнал -->
      <div class="card">
        <div class="font-bold mb-3">📜 Журнал</div>
        <div class="text-xs space-y-2 max-h-[480px] overflow-y-auto text-slate-400">
          <div v-for="(l, i) in recentLog" :key="i" class="border-b border-slate-800/50 pb-1">
            {{ l }}
          </div>
          <div v-if="!recentLog.length" class="italic">Начни день, чтобы увидеть события.</div>
        </div>
      </div>
    </div>

    <EventModal
      v-if="currentEvent"
      :event="currentEvent"
      @choice="onChoice"
      @close="onCloseEvent"
    />
  </div>
</template>