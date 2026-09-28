<script setup>
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const store = useProjectStore()

function startNew() {
  store.reset()
  router.push({ name: 'case-select' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6">
    <div class="text-center mb-12">
      <div class="text-6xl mb-4">🎮</div>
      <h1 class="text-5xl font-extrabold tracking-tight mb-3">
        PM <span class="text-brand-500">Trainer</span>
      </h1>
      <p class="text-slate-400 text-lg max-w-xl">
        Собери проект, проживи день из жизни менеджера.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
      <button @click="startNew" class="card hover:border-brand-500 transition text-left group">
        <div class="text-4xl mb-3">🧩</div>
        <div class="text-xl font-bold mb-1 group-hover:text-brand-500">Собери проект</div>
        <div class="text-slate-400 text-sm">
          Инициация → команда → WBS → риски.<br />
          На выходе — паспорт проекта.
        </div>
      </button>

      <button
        @click="router.push('/life/day')"
        :disabled="!store.passport"
        class="card text-left transition"
        :class="store.passport
          ? 'hover:border-brand-500 cursor-pointer group'
          : 'opacity-40 cursor-not-allowed'"
      >
        <div class="text-4xl mb-3">🗓</div>
        <div class="text-xl font-bold mb-1">День из жизни</div>
        <div class="text-slate-400 text-sm">
          Управляй своей командой, реагируй на события, спасай проект.
        </div>
        <div v-if="!store.passport" class="text-warn text-xs mt-2">
          ⚠️ Сначала собери проект
        </div>
      </button>
    </div>

  </div>
</template>