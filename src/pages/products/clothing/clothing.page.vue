
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['clothing'])
</script>

<template>
  {{props.clothing}}
</template>
