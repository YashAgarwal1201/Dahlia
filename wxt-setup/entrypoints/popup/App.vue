<script lang="ts" setup>
const handleThemeCardClick = () => {
  alert("Theme card clicked!");
};
</script>

<template>
  <div class="ext-main-container">
    <div class="ext-header">
      <h2>ABCD</h2>
      <p>Choose wikipedia layout</p>
    </div>

    <div class="ext-content">
      <div class="theme-container">
        <h3>Choose theme</h3>
        <select @change="handleThemeCardClick">
          <option v-for="n in 4" :key="n" :value="n">Theme {{ n }}</option>
        </select>
      </div>

      <div class="divider"></div>

      <div class="night-mode-container">
        <h3>Night Mode?</h3>

        <div>Yes</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ext-main-container {
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
}

.ext-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: white;
}

.ext-header h2 {
  margin: 0;
  font-size: 1.5rem;
}
.ext-header p {
  margin: 0px;
  font-size: 0.875rem;
}

.ext-content {
  display: flex;
  flex-direction: column;
  /* gap: 1rem; */
  padding: 0.5rem;
}
.divider {
  width: 100%;
  height: 1px;
  margin-block: 1rem;
  background-color: #d1d5db;
}
.theme-container,
.night-mode-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.ext-content h3 {
  margin: 0px;
  font-size: 1rem;
}
</style>
