<template>
  <v-flex xs12 sm8 md4>
    <v-btn @click="fetchProfile">
      Fetch Profile
    </v-btn>
    <v-btn @click="test">
      401 Unauthorized Response
    </v-btn>
    <v-btn @click="logout">
      Logout
    </v-btn>
  </v-flex>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    fetchProfile() {
      this.$axios.get('/api/auth/me')
    },
    test() {
      this.$axios.post('/api/auth/test')
    },
    logout() {
      this.$auth.logout()
    }
  }
}
</script>
