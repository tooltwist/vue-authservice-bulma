<template lang="pug">
  span.authservice-firstname
    | {{ $authservice.user.firstname }}
</template>

<script>
/**
 * Display the full name of a user (first name and last name, but not middle name).
 */
export default {
  name: 'authservice-firstname',
}
</script>

<style>
/**
 *  Style specifically for firstname
 *  @style
 */
.authservice-firstname {

}
</style>
