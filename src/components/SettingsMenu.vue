<template>
  <div class="weather-card">
    <CardHeader
      :is-open="props.showSettings"
      @settings-switcher="toggleSettings"
    >
      Настройки
    </CardHeader>

    <div class="weather-card__body">
      <draggable
        v-model="localCities"
        class="city-list"
        item-key="id"
        ghost-class="city-list__ghost"
        chosen-class="city-list__chosen"
        @end="emitUpdateCities"
      >
        <template #item="{ element }">
          <div class="city-list__item">
            <span>{{ element.name }}</span>
            <button @click="removeCity(element.id)">
              <svg
                class="remove"
                xmlns="http://www.w3.org/2000/svg"
                xml:space="preserve"
                viewBox="0 0 41.76 41.76"
              >
                <path
                  d="M27.95 20.88 40.29 8.54a5 5 0 1 0-7.07-7.07L20.88 13.8 8.54 1.46a5 5 0 0 0-7.07 7.08L13.8 20.88 1.46 33.22a5 5 0 1 0 7.08 7.07l12.34-12.34 12.34 12.34a4.98 4.98 0 0 0 7.07 0 5 5 0 0 0 0-7.07L27.95 20.88z"
                />
              </svg>
            </button>
          </div>
        </template>
      </draggable>
    </div>

    <div class="weather-card__footer">
      <div class="input-form">
        <input
          v-model="newCity"
          @keyup.enter="emitAddCity"
          placeholder="Введите название города"
        />
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
      <button @click="emitAddCity">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path
            fill="#000"
            d="M4 18h8a2.5 2.5 0 0 0 2.5-2.5V9H12a1 1 0 0 1-.7-1.7l4-4a1 1 0 0 1 1.4 0l4 4A1 1 0 0 1 20 9h-2.5v6.5A5.5 5.5 0 0 1 12 21H4a1 1 0 0 1-1-1v-1c0-.6.4-1 1-1Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import draggable from 'vuedraggable'
  import { WeatherCardModel } from '@/types/OpenWeather'
  import CardHeader from '@/components/CardHeader.vue'

  const props = defineProps<{
    cities: Array<WeatherCardModel>
    showSettings: boolean
  }>()
  const emit = defineEmits(['add-city', 'update-cities', 'close-settings'])

  const localCities = ref([...props.cities])
  console.log('props', props)
  // const localCities = ref([
  //   {
  //     id: 1735128747425,
  //     name: 'Санкт-Петербург',
  //     icon: '04n',
  //     description: 'пасмурно',
  //     temperature: 3.36,
  //     feels_like: -0.16,
  //     temp_min: 3.08,
  //     temp_max: 3.36,
  //     pressure: 1023,
  //     humidity: 95,
  //   },
  //   {
  //     id: 1735128754831,
  //     name: 'Ульяновск',
  //     icon: '04n',
  //     description: 'пасмурно',
  //     temperature: -6.8,
  //     feels_like: -6.8,
  //     temp_min: -6.8,
  //     temp_max: -6.8,
  //     pressure: 1030,
  //     humidity: 96,
  //   },
  //   {
  //     id: 1735128023526,
  //     name: 'Москва',
  //     icon: '04n',
  //     description: 'пасмурно',
  //     temperature: -0.62,
  //     feels_like: -2.75,
  //     temp_min: -1.71,
  //     temp_max: 0.77,
  //     pressure: 1032,
  //     humidity: 65,
  //   },
  //   {
  //     id: 1735301599542,
  //     name: 'Самара',
  //     icon: '04d',
  //     description: 'пасмурно',
  //     temperature: -4.08,
  //     feels_like: -9.5,
  //     temp_min: -4.08,
  //     temp_max: -4.08,
  //     pressure: 1029,
  //     humidity: 92,
  //   },
  //   {
  //     id: 1735301600837,
  //     name: 'Казань',
  //     icon: '13d',
  //     description: 'небольшой снег',
  //     temperature: -0.66,
  //     feels_like: -5.56,
  //     temp_min: -0.66,
  //     temp_max: -0.66,
  //     pressure: 1024,
  //     humidity: 98,
  //   },
  //   {
  //     id: 1735301610967,
  //     name: 'Нижний Новгород',
  //     icon: '04d',
  //     description: 'пасмурно',
  //     temperature: 0.73,
  //     feels_like: -1.61,
  //     temp_min: 0.73,
  //     temp_max: 0.73,
  //     pressure: 1026,
  //     humidity: 100,
  //   },
  //   {
  //     id: 1735301620717,
  //     name: 'Саранск',
  //     icon: '04d',
  //     description: 'пасмурно',
  //     temperature: -1.73,
  //     feels_like: -6.75,
  //     temp_min: -1.73,
  //     temp_max: -1.73,
  //     pressure: 1029,
  //     humidity: 96,
  //   },
  // ])
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

<style lang="scss">
  .weather-card {
    padding: 1rem;
  }

  .city-list-drag {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .city-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem;
    cursor: grab;
  }

  .flip-list-move {
    transition: transform 0.5s;
  }

  .error {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
</style>
