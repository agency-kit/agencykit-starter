
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['postC'])
</script>

<template>
  {{props.postC}}
</template>
