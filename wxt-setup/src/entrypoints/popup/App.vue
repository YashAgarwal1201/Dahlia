<template>
  <div class="theme-selector-container">
    <h3 class="header">Select Wikipedia Theme</h3>
    <select v-model="selectedTheme" @change="setTheme">
      <option value="material-light">Material Light</option>
      <option value="material-dark">Material Dark</option>
      <!-- More themes as needed -->
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// WXT automatically exposes browser APIs 
const selectedTheme = ref('material-light');

// On load, sync with storage
onMounted(() => {
  browser.storage.sync.get('theme', ({ theme }) => {
    selectedTheme.value = theme || 'material-light';
  });
});

const setTheme = () => {
  browser.storage.sync.set({ theme: selectedTheme.value });
}
</script>


<style lang="css" scoped>
.theme-selector-container {
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: black;
  color: white;
}
h3 {
  margin: 0;
  text-align: center;
  font-size: 18px;
  margin-bottom: 1rem;
}

select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: none;
  background-color: #333;
  color: white;
  font-size: 1rem;
}
</style>


<style>
html {
  width: 360px;
}
body {
  margin: 0px;
  padding: 0.5rem;
}
</style>
