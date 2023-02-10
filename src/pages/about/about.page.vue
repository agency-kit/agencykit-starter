
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['about'])
</script>

<template>
  {{props.about}}
</template>
