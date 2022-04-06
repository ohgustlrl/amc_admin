<template>
  <div>
    <template>
      <v-banner
        outlined
        rounded
        shaped
        single-line
        mb="2"
      >
        <v-icon
          slot="icon"
          color="primary"
          size="36"
        >
          mdi-record-rec
        </v-icon>
          전적조회
      </v-banner>
    </template>
    <v-col
      d-flex
      cols="20"
      am="10"
    >
      <v-text-field
        v-model="saerch"
        filled
        label="아이디를 입력하세요"
        clearable
        hide-details
        prepend-icon="mdi-magnify"
      ></v-text-field>
    </v-col>
  </div>  
</template>

<script>
export default {
  name: "record_search",

  data() {
    return {
      saerch : '',
    }
  },

  components: {
  },
  
};
</script>