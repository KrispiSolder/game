<script setup>
defineProps({ store: Object })
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
    <div class="card py-3">
      <div class="text-xs text-slate-500">📅 День</div>
      <div class="text-xl font-bold">{{ store.day }} / {{ store.plannedDuration }}</div>
    </div>
    <div class="card py-3">
      <div class="text-xs text-slate-500">💰 Бюджет</div>
      <div class="text-xl font-bold"
           :class="store.spent > store.budget ? 'text-danger' : 'text-success'">
        {{ (store.budget - store.spent).toLocaleString('ru') }} ₽
      </div>
    </div>
    <div class="card py-3">
      <div class="text-xs text-slate-500">✅ Прогресс</div>
      <div class="text-xl font-bold">{{ store.progress }}%</div>
    </div>
    <div class="card py-3">
      <div class="text-xs text-slate-500">😊 Мораль</div>
      <div class="text-xl font-bold"
           :class="store.morale < 30 ? 'text-danger' : store.morale < 60 ? 'text-warn' : 'text-success'">
        {{ store.morale }}%
      </div>
    </div>
    <div class="card py-3">
      <div class="text-xs text-slate-500">⚠️ Риски</div>
      <div class="text-xl font-bold">{{ store.risks.length }}</div>
    </div>
  </div>
</template>