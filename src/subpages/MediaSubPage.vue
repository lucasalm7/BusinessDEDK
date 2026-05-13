<script>

</script>

<template>
<div class="video-player" v-html="video.acf.videoLink"></div>

<h1>{{ video.title }}</h1>
<p class="type">Category: {{ video.acf.videoType }}</p>
<div class="description">{{ video.acf.videoDescription }}</div>
</template>