<script setup>
  const props = defineProps(['page'])
</script>

<template>
  <div v-html="page.content"></div>
</template>
