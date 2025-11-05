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
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-light);
  padding: 20px;
  transition: all var(--transition-normal);
}

.card-clickable {
  cursor: pointer;
}

.card-clickable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

.card-active {
  border: 3px solid var(--primary-color);
  box-shadow: var(--shadow-medium);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--bg-secondary);
}

.card-title {
  font-size: var(--font-size-large);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.card-badge {
  padding: 4px 12px;
  background: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: var(--font-size-small);
  font-weight: 500;
}

.card-body {
  color: var(--text-primary);
}

.card-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 2px solid var(--bg-secondary);
}

/* 类型样式 */
.card-primary {
  border-left: 4px solid var(--primary-color);
}

.card-success {
  border-left: 4px solid var(--success-color);
}

.card-warning {
  border-left: 4px solid var(--warning-color);
}
</style>

