<template>
  <button
    class="app-button"
    :class="[`btn-${type}`, `btn-${size}`, { 'btn-disabled': disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span v-if="icon" class="btn-icon">{{ icon }}</span>
    <span class="btn-text">{{ text }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'primary' // primary/secondary/success/warning/error
  },
  size: {
    type: String,
    default: 'medium' // small/medium/large
  },
  icon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: var(--border-radius-medium);
  font-family: var(--font-family);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-light);
}

.app-button:hover:not(.btn-disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.app-button:active:not(.btn-disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-light);
}

/* 类型样式 */
.btn-primary {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FB3 100%);
  color: white;
}

.btn-secondary {
  background: linear-gradient(135deg, #FFA07A 0%, #FFB89A 100%);
  color: white;
}

.btn-success {
  background: linear-gradient(135deg, #98D8C8 0%, #B0E8D8 100%);
  color: white;
}

.btn-warning {
  background: linear-gradient(135deg, #FFD93D 0%, #FFE16D 100%);
  color: #333;
}

.btn-error {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8B8B 100%);
  color: white;
}

/* 尺寸样式 */
.btn-small {
  padding: 8px 16px;
  font-size: var(--font-size-small);
}

.btn-medium {
  padding: 12px 24px;
  font-size: var(--font-size-medium);
}

.btn-large {
  padding: 16px 32px;
  font-size: var(--font-size-large);
}

/* 禁用状态 */
.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.2em;
}

.btn-text {
  line-height: 1;
}
</style>

