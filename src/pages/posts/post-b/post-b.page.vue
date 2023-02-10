
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['postB'])
</script>

<template>
  {{props.postB}}
</template>
