<template>
  <div class="weather-card__header">
    <h3><slot /></h3>
    <button @click="$emit('settings-switcher')">⚙️</button>
  </div>
</template>
