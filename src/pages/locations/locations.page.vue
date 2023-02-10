
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['locations'])
</script>

<template>
  {{props.locations}}
</template>
