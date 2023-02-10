
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['chairs'])
</script>

<template>
  {{props.chairs}}
</template>
