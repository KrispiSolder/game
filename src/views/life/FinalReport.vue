<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const store = useProjectStore()

const verdict = computed(() => {
  if (store.success) return { emoji: '🎉', title: 'Проект сдан!', color: 'text-success' }
  return { emoji: '💀', title: 'Проект провален', color: 'text-danger' }
})

const deviation = computed(() => {
  const plan = store.plannedDuration
  const fact = store.day
  const pct = ((fact - plan) / plan * 100).toFixed(1)
  return pct
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <div class="text-center mb-10">
      <div class="text-7xl mb-3">{{ verdict.emoji }}</div>
      <h1 class="text-4xl font-extrabold mb-2" :class="verdict.color">{{ verdict.title }}</h1>
      <p class="text-slate-400">Разбор план/факт — как в разделе 4.2 твоего курсового</p>
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
            <td class="text-right"
                :class="deviation > 0 ? 'text-danger' : 'text-success'">
              {{ deviation > 0 ? '+' : '' }}{{ deviation }}%
            </td>
          </tr>
          <tr class="border-t border-slate-800">
            <td class="py-2">Бюджет</td>
            <td class="text-right">{{ store.budget.toLocaleString('ru') }} ₽</td>
            <td class="text-right">{{ store.spent.toLocaleString('ru') }} ₽</td>
            <td class="text-right"
                :class="store.spent > store.budget ? 'text-danger' : 'text-success'">
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
        </tbody>
      </table>
    </div>

    <!-- Выводы -->
    <div class="card mb-6">
      <div class="font-bold mb-3">🎓 Выводы</div>
      <ul class="text-sm text-slate-300 space-y-2 list-disc pl-5">
        <li v-if="store.success">
          Планирование было <b>эффективным</b>: уложился в срок и бюджет.
        </li>
        <li v-else>
          Проект <b>провален</b>. Часто причина — недооценка рисков и перегруз команды.
        </li>
        <li>В курсовом это раздел <b>4.1–4.2</b> — обязательно сделай такой же разбор.</li>
        <li>Анализ рисков из режима 1 напрямую повлиял на события в режиме 2.</li>
      </ul>
    </div>

    <div class="flex gap-3">
      <button @click="router.push('/')" class="btn-primary flex-1">
        🔁 Пройти заново
      </button>
    </div>
  </div>
</template>