
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['services'])
</script>

<template>
  {{props.services}}
</template>
