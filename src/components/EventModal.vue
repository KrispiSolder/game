<script setup>
defineProps({ event: Object })
defineEmits(['choice', 'close'])
</script>

<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="card max-w-lg w-full">
      <div class="text-5xl mb-3 text-center">{{ event.emoji }}</div>
      <div class="text-2xl font-bold text-center mb-2">{{ event.title }}</div>
      <div class="text-slate-400 text-center mb-6">{{ event.text }}</div>

      <!-- Если есть выбор -->
      <div v-if="event.choices" class="space-y-2">
        <button
          v-for="(c, i) in event.choices" :key="i"
          @click="$emit('choice', c.effect)"
          class="btn-ghost w-full text-left"
        >
          {{ c.text }}
        </button>
      </div>

      <!-- Иначе — просто закрыть -->
      <button v-else @click="$emit('close')" class="btn-primary w-full">
        Ок, продолжаем
      </button>
    </div>
  </div>
</template>