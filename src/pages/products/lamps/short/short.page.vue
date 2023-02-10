
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['short'])
</script>

<template>
  {{props.short}}
</template>
