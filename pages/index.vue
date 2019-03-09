<template>
  <v-flex xs12 sm8 md4>
    <v-form ref="form" v-model="valid" method="POST" @submit.prevent="login">
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Online Shop - Login Form</v-toolbar-title>                
        </v-toolbar>    
        <v-card-text>
          <v-alert
            :value="errorMessage !== null"
            type="error"
            class="mb-4"
            outline            
          >
            {{ errorMessage }}
          </v-alert>      
          <v-text-field
            v-model="username"
            :rules="[rules.required]"
            name="username"
            label="Username"
          />
          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
            :rules="[rules.required, rules.min]"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            label="Password"
            hint="At least 8 characters"
            @click:append="showPassword = !showPassword"
          />          
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" type="submit">
            Login
          </v-btn>          
        </v-card-actions>  
      </v-card>
    </v-form>
  </v-flex>  
</template>

<script>
export default {
  layout: 'login',
  data() {
    return {
      valid: false,
      username: '',
      password: '',
      showPassword: false,
      errorMessage: null,
      rules: {
        required: value => !!value || 'Required',
        min: value => value.length >= 8 || 'Min 8 characters'
      }
    }
  },
  methods: {
    async login() {
      this.$refs.form.validate()
      this.errorMessage = null
      if (this.valid) {
        try {
          await this.$store.dispatch('auth/login', {
            username: this.username,
            password: this.password
          })
          this.$router.push('/dashboard')
        } catch (e) {
          if (e.response.data && e.response.data.error) {
            this.errorMessage = e.response.data.error.message
          } else {
            this.errorMessage = e.message
          }
        }
      }
    }
  }
}
</script>
