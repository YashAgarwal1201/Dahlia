<template>
  <div class="popup-container">
    <h2 class="main-header">Avocado</h2>
    <p class="description">Style Wikipedia with selectable themes</p>
  <div class="theme-selector-container">
    <h3 class="header">Select Wikipedia Theme</h3>
    <select v-model="selectedTheme" @change="setTheme">
      <option value="material-light">Material Light</option>
      <option value="material-dark">Material Dark</option>
      <option value="apple-liquid-glass">Apple Liquid Glass</option>
      <option value="apple-liquid-glass-dark">Apple Dark Glass</option>
      <option value="win-ui">Windows UI</option>
      <option value="win-ui-dark">Windows UI Dark</option>
      <!-- More themes as needed -->
    </select>
  </div></div>
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
.popup-container {
  padding: 0.5rem;
  border: 1px solid #e1e5eb;
  background-color: transparent;
  border-radius: 0.5rem;
  color: black;
}
.popup-container .main-header {
  font-size: 20px;
  text-align: center;
  margin: 0px;
}
.popup-container .description {
  font-size: 14px;
  text-align: center;
  margin: 0px;
}
.theme-selector-container {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: black;
  color: white;
}

h3 {
  margin: 0;
  text-align: left;
  font-size: 16px;
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
  background-color: grey;
  border-radius: 0.5rem !important;
}
body {
  margin: 0px;
  padding: 0.5rem;
}
</style>
