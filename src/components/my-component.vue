<template lang="html">
  <strong>{{ text }}</strong>
</template>

<script>
/**
 * This is a
 * lovely component ABCD.
 */
export default {
  name: 'my-component',
  props: {
    /**
     * We have a lovely property named text.
     */
    text: {
      type: String,
      default: 'Test text',
      required: true
    },
  }
}
</script>
