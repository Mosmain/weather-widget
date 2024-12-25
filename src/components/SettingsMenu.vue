<template>
  <div class="weather-card">
    <CardHeader @settings-switcher="toggleSettings">Настройки</CardHeader>
    <input
      v-model="newCity"
      @keyup.enter="emitAddCity"
      placeholder="Введите название города"
    />
    <button @click="emitAddCity">Добавить</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <draggable
      v-model="localCities"
      class="city-list-drag"
      item-key="id"
      @end="emitUpdateCities"
    >
      <template #item="{ element }">
        <div class="city-item">
          <span>{{ element.name }}</span>
          <button @click="removeCity(element.id)">🗑️</button>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import draggable from 'vuedraggable'
  import { WeatherCardModel } from '@/types/OpenWeather'
  import CardHeader from '@/components/CardHeader.vue'

  const props = defineProps<{ cities: Array<WeatherCardModel> }>()
  const emit = defineEmits(['add-city', 'update-cities', 'close-settings'])

  const localCities = ref([...props.cities])
  const newCity = ref('')
  const errorMessage = ref('')

  function emitAddCity() {
    if (!newCity.value.trim()) {
      errorMessage.value = 'Введите название города'
      return
    }

    emit('add-city', newCity.value.trim())
    newCity.value = ''
    errorMessage.value = ''

    emitUpdateCities()
  }

  function removeCity(id: number) {
    localCities.value = localCities.value.filter((city) => city.id !== id)
    emitUpdateCities()
  }

  function emitUpdateCities() {
    emit('update-cities', localCities.value)
  }

  const toggleSettings = () => {
    emit('close-settings')
  }
</script>
