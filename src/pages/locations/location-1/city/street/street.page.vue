
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['street'])
</script>

<template>
  {{props.street}}
</template>
