<template lang="pug">
  .fullname
    | {{ $authservice.user.firstname }} {{ $authservice.user.lastname }}
</template>

<script>
/**
 * Display the full name of a user (first name and last name, but not middle name).
 */
export default {
  name: 'authservice-fullname',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .fullname {
    display: inline-block;
    color: red;
  }
</style>
