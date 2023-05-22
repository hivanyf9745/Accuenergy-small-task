<template>
  <section class="mt-3">
    <div class="d-flex align-items-center justify-content-around col-12 latest-container p-3">
      <h5 class="text-primary text-center col-4">Latest Time Zone & Local Time</h5>
      <div class="col-4 text-start">
        <p class="time-zone-local">Time Zone: {{ timeZoneId }}</p>
        <p class="time-zone-local">Local Time: {{ localTime }}</p>
      </div>
    </div>
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

<style>
.time-zone-local {
  font-size: 1rem;
}

.latest-container {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 1rem;
}
</style>
