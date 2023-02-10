
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['posts'])
</script>

<template>
  {{props.posts}}
</template>
