
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['products'])
</script>

<template>
  {{props.products}}
</template>
