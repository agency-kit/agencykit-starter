
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['medium'])
</script>

<template>
  {{props.medium}}
</template>
