
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['city'])
</script>

<template>
  {{props.city}}
</template>
