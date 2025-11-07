<template>
  <div
    class="app-card"
    :class="[`card-${type}`, { 'card-clickable': clickable, 'card-active': active }]"
    @click="handleClick"
  >
    <div v-if="title" class="card-header">
      <h3 class="card-title">{{ title }}</h3>
      <span v-if="badge" class="card-badge">{{ badge }}</span>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'default' // default/primary/success/warning
  },
  clickable: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.app-card {
  background: var(--bg-card);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-light);
  padding: var(--spacing-lg);
  transition: all var(--transition-normal);
  border: 1px solid var(--border-light);
  position: relative;
  overflow: hidden;
}

/* 卡片背景光效（可选） */
.app-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-slow);
  pointer-events: none;
}

.app-card:hover::before {
  opacity: 1;
}

.card-clickable {
  cursor: pointer;
}

.card-clickable:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: var(--shadow-heavy);
  border-color: var(--primary);
}

.card-clickable:active {
  transform: translateY(-2px) scale(1);
  box-shadow: var(--shadow-medium);
}

.card-active {
  border: 2px solid var(--primary);
  box-shadow: var(--shadow-medium);
  background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-light);
}

.card-title {
  font-size: var(--font-size-large);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.5px;
}

.card-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--primary);
  color: var(--text-inverse);
  border-radius: 20px;
  font-size: var(--font-size-small);
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.card-body {
  color: var(--text-primary);
  position: relative;
  z-index: 1;
}

.card-footer {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-light);
}

/* 类型样式 */
.card-primary {
  border-left: 4px solid var(--primary);
}

.card-primary:hover {
  box-shadow: 0 8px 24px rgba(52, 152, 219, 0.2);
}

.card-success {
  border-left: 4px solid var(--success);
}

.card-success:hover {
  box-shadow: 0 8px 24px rgba(46, 204, 113, 0.2);
}

.card-warning {
  border-left: 4px solid var(--warning);
}

.card-warning:hover {
  box-shadow: 0 8px 24px rgba(243, 156, 18, 0.2);
}
</style>

