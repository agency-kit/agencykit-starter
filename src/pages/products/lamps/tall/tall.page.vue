
<script setup>
import Post from '../layouts/post.vue';
const props = defineProps(['tall'])
</script>

<template>
  {{props.tall}}
</template>
