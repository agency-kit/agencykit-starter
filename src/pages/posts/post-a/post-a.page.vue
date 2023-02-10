
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['postA'])
</script>

<template>
  {{props.postA}}
</template>
