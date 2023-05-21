<template>
  <section class="mt-3">
    <h2>Latest Time Zone & Local Time</h2>
    <p>Time Zone: {{ timeZoneId }}</p>
    <p>Local Time: {{ localTime }}</p>
  </section>
</template>

<script>
export default {
  props: {
    localTime: {
      type: String,
      required: true
    },
    timeZoneId: {
      type: String,
      required: true
    }
  }
}
</script>
