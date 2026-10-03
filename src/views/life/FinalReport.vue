<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const store = useProjectStore()

const verdict = computed(() =>
  store.success
    ? { emoji: '🎉', title: 'Проект сдан!', color: 'text-success' }
    : { emoji: '💀', title: 'Проект провален', color: 'text-danger' }
)

const reason = computed(() => store.failureReason || '')

const deviation = computed(() => {
  const pct = ((store.day - store.plannedDuration) / store.plannedDuration) * 100
  return pct.toFixed(1)
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <div class="text-center mb-10">
      <div class="text-7xl mb-3">{{ verdict.emoji }}</div>
      <h1 class="text-4xl font-extrabold mb-2" :class="verdict.color">{{ verdict.title }}</h1>
      <p v-if="reason" class="text-danger text-sm">{{ reason }}</p>
      <p v-else class="text-slate-400">Разбор план/факт — как в разделе 4.2 курсового</p>
    </div>

    <!-- Сравнение -->
    <div class="card mb-6">
      <div class="font-bold mb-4">📊 План / Факт</div>
      <table class="w-full text-sm">
        <thead class="text-slate-500 text-xs">
          <tr>
            <th class="text-left py-2">Показатель</th>
            <th class="text-right">План</th>
            <th class="text-right">Факт</th>
            <th class="text-right">Отклонение</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-t border-slate-800">
            <td class="py-2">Срок</td>
            <td class="text-right">{{ store.plannedDuration }} дн.</td>
            <td class="text-right">{{ store.day }} дн.</td>
            <td class="text-right" :class="deviation > 0 ? 'text-danger' : 'text-success'">
              {{ deviation > 0 ? '+' : '' }}{{ deviation }}%
            </td>
          </tr>
          <tr class="border-t border-slate-800">
            <td class="py-2">Бюджет</td>
            <td class="text-right">{{ store.budget.toLocaleString('ru') }} ₽</td>
            <td class="text-right">{{ store.spent.toLocaleString('ru') }} ₽</td>
            <td class="text-right" :class="store.spent > store.budget ? 'text-danger' : 'text-success'">
              {{ store.spent > store.budget ? 'Перерасход' : 'Экономия' }}
            </td>
          </tr>
          <tr class="border-t border-slate-800">
            <td class="py-2">Задачи</td>
            <td class="text-right">{{ store.wbs.length }}</td>
            <td class="text-right">{{ store.doneTasks.length }}</td>
            <td class="text-right">
              {{ store.doneTasks.length === store.wbs.length ? '✅ Все' : '⚠️ Не все' }}
            </td>
          </tr>
          <tr class="border-t border-slate-800">
            <td class="py-2">Мораль команды</td>
            <td class="text-right">100%</td>
            <td class="text-right">{{ store.morale }}%</td>
            <td class="text-right">
              {{ store.morale < 50 ? '😢 Выгорание' : '😊 Норма' }}
            </td>
          </tr>
          <tr class="border-t border-slate-800">
            <td class="py-2">Риски</td>
            <td class="text-right">{{ store.risks.length }}</td>
            <td class="text-right">{{ store.triggeredRisks.length }} сработало</td>
            <td class="text-right">
              {{ store.triggeredRisks.length > store.risks.length / 2 ? '⚠️ Много' : 'Ок' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Разбор -->
    <div class="card mb-6">
      <div class="font-bold mb-3">🎓 Что повлияло на финал</div>
      <ul class="text-sm text-slate-300 space-y-2 list-disc pl-5">
        <li v-if="store.morale < 50">
          <b>Низкая мораль</b> ({store.morale}%) снизила скорость команды — часть дней ушла впустую.
        </li>
        <li v-if="store.spent > store.budget">
          Бюджет превышен на <b>{{ (store.spent - store.budget).toLocaleString('ru') }} ₽</b>. Дорогая команда «съела» резерв.
        </li>
        <li v-if="store.triggeredRisks.length">
          Сработало <b>{{ store.triggeredRisks.length }}</b> риск(ов). Чем выше ты их оценил, тем чаще они активировались.
        </li>
        <li v-if="store.wbsMistakes">
          В WBS было <b>{{ store.wbsMistakes }}</b> ошибок распределения задач.
        </li>
        <li v-if="store.success">
          Ты уложился в план — модель планирования была <b>эффективной</b>.
        </li>
      </ul>
    </div>

    <button @click="router.push('/')" class="btn-primary w-full">
      🔁 Пройти заново
    </button>
  </div>
</template>