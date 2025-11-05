<template>
  <div class="app-progress">
    <div class="progress-info" v-if="showInfo">
      <span class="progress-label">{{ label }}</span>
      <span class="progress-value">{{ percent }}%</span>
    </div>
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: `${percent}%` }"
        :class="`progress-${type}`"
      ></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  percent: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: '进度'
  },
  type: {
    type: String,
    default: 'primary' // primary/success/warning/error
  },
  showInfo: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.app-progress {
  width: 100%;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.progress-value {
  font-size: var(--font-size-small);
  font-weight: 600;
  color: var(--text-primary);
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: var(--bg-secondary);
  border-radius: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 20px;
  transition: width 0.5s ease;
}

.progress-primary {
  background: linear-gradient(90deg, #FF6B9D 0%, #FF8FB3 100%);
}

.progress-success {
  background: linear-gradient(90deg, #98D8C8 0%, #B0E8D8 100%);
}

.progress-warning {
  background: linear-gradient(90deg, #FFD93D 0%, #FFE16D 100%);
}

.progress-error {
  background: linear-gradient(90deg, #FF6B6B 0%, #FF8B8B 100%);
}
</style>

