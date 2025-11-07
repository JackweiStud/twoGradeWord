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
  gap: var(--spacing-sm);
  border: none;
  border-radius: var(--radius-medium);
  font-family: var(--font-family);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-light);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

/* 按钮闪光效果 */
.app-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.app-button:hover::after:not(.btn-disabled) {
  width: 300px;
  height: 300px;
}

.app-button:hover:not(.btn-disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-heavy);
}

.app-button:active:not(.btn-disabled) {
  transform: translateY(-1px) scale(0.98);
  box-shadow: var(--shadow-light);
}

/* 类型样式 - 使用主题变量 */
.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: var(--text-inverse);
}

.btn-primary:hover:not(.btn-disabled) {
  background: linear-gradient(135deg, var(--primary-hover) 0%, var(--primary) 100%);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-hover) 100%);
  color: var(--text-inverse);
}

.btn-secondary:hover:not(.btn-disabled) {
  background: linear-gradient(135deg, var(--secondary-hover) 0%, var(--secondary) 100%);
  box-shadow: 0 6px 20px rgba(255, 165, 0, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, var(--success) 0%, #27AE60 100%);
  color: var(--text-inverse);
}

.btn-success:hover:not(.btn-disabled) {
  background: linear-gradient(135deg, #27AE60 0%, var(--success) 100%);
  box-shadow: 0 6px 20px rgba(46, 204, 113, 0.3);
}

.btn-warning {
  background: linear-gradient(135deg, var(--warning) 0%, #E67E22 100%);
  color: var(--text-inverse);
}

.btn-warning:hover:not(.btn-disabled) {
  background: linear-gradient(135deg, #E67E22 0%, var(--warning) 100%);
  box-shadow: 0 6px 20px rgba(243, 156, 18, 0.3);
}

.btn-error {
  background: linear-gradient(135deg, var(--error) 0%, #C0392B 100%);
  color: var(--text-inverse);
}

.btn-error:hover:not(.btn-disabled) {
  background: linear-gradient(135deg, #C0392B 0%, var(--error) 100%);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
}

/* 尺寸样式 */
.btn-small {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-small);
}

.btn-medium {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-medium);
}

.btn-large {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-large);
}

/* 禁用状态 */
.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(50%);
}

.btn-icon {
  font-size: 1.3em;
  display: flex;
  align-items: center;
}

.btn-text {
  line-height: 1;
  position: relative;
  z-index: 1;
}
</style>

