<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { characters } from '@/data/characters'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const store = useProjectStore()

const budget = 60000          // виртуальный бюджет на команду
const picked = ref(new Set())

const spent = computed(() =>
  [...picked.value].reduce((sum, id) => {
    const c = characters.find(x => x.id === id)
    return sum + c.cost
  }, 0)
)

const left = computed(() => budget - spent.value)

function toggle(id) {
  const s = new Set(picked.value)
  const c = characters.find(x => x.id === id)
  if (s.has(id)) {
    s.delete(id)
  } else {
    if (spent.value + c.cost > budget) return
    s.add(id)
  }
  picked.value = s
}

const canNext = computed(() => picked.value.size >= 3)

function next() {
  store.team = [...picked.value].map(id => characters.find(c => c.id === id))
  router.push({ name: 'wbs-builder' })
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <div class="mb-8">
      <div class="text-slate-500 text-sm mb-1">Этап 2 из 4</div>
      <h1 class="text-3xl font-extrabold">Собери команду</h1>
      <p class="text-slate-400">Минимум 3 человека. Бюджет ограничен, характеры — тоже.</p>
    </div>

    <!-- Бюджет -->
    <div class="card mb-6 flex items-center justify-between">
      <div>
        <div class="text-slate-400 text-sm">Бюджет на команду</div>
        <div class="text-2xl font-bold">{{ budget.toLocaleString('ru') }} ₽</div>
      </div>
      <div class="text-right">
        <div class="text-slate-400 text-sm">Потрачено</div>
        <div class="text-2xl font-bold"
             :class="left < 0 ? 'text-danger' : 'text-success'">
          {{ spent.toLocaleString('ru') }} ₽
        </div>
        <div class="text-xs text-slate-500">Осталось: {{ left.toLocaleString('ru') }} ₽</div>
      </div>
    </div>

    <!-- Персонажи -->
    <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
      <button
        v-for="c in characters" :key="c.id"
        @click="toggle(c.id)"
        class="card text-left transition hover:border-brand-500"
        :class="picked.has(c.id) ? 'border-brand-500 ring-2 ring-brand-500/40' : ''"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="text-4xl">{{ c.emoji }}</div>
          <div class="text-xs font-bold px-2 py-1 rounded-full bg-slate-800">
            {{ c.cost.toLocaleString('ru') }} ₽
          </div>
        </div>
        <div class="font-bold">{{ c.name }}</div>
        <div class="text-xs text-slate-500 mb-2">{{ c.role }}</div>
        <div class="text-xs text-slate-400 italic mb-3">«{{ c.quirks }}»</div>
        <div class="flex gap-2 text-xs">
          <span class="tag bg-blue-900/60">⚡ {{ c.speed }}</span>
          <span class="tag bg-purple-900/60">⭐ {{ c.quality }}</span>
        </div>
      </button>
    </div>

    <div class="mt-8 flex justify-between items-center">
      <button @click="router.back()" class="btn-ghost">← Назад</button>
      <button
        @click="next"
        :disabled="!canNext"
        class="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Дальше → WBS
      </button>
    </div>
  </div>
</template>