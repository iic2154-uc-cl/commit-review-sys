import './assets/main.css'
import '@vueform/multiselect/themes/default.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { createVuetify } from 'vuetify'
import 'vuetify/styles'

import App from './App.vue'
import router from './router'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { fas } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(fas)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(createVuetify())
app.use(router)
app.mount('#app')

