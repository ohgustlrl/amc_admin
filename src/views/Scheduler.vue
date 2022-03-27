<template>
  <div>
    <h1>애플망고 스케쥴러</h1>
    <Calendars></Calendars>
  </div>
</template>

<script>
import Calendars from "../components/calendars.vue";

export default {
  name: "amang-Scheduler",

  components: {
    Calendars,
  },
};
</script>
