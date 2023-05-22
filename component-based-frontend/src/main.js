import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Bootstrap modules
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '../scss/custom.scss'

/**************/
// Components imports
import ButtonLocation from './components/ButtonLocation.vue'
import SearchInput from './components/SearchInput.vue'
import PageList from './components/PageList.vue'
import LatestTime from './components/LatestTime.vue'
import SmallAssessment from './components/SmallAssessment.vue'
/**************/

const app = createApp(App)

// Components
app.component('button-location', ButtonLocation)
app.component('search-input', SearchInput)
app.component('page-list', PageList)
app.component('latest-time', LatestTime)
app.component('small-assessment', SmallAssessment)

app.mount('#app')
