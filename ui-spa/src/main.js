import Vue from "vue";

Vue.config.productionTip = false;

import Vuetify from "vuetify";

Vue.use(Vuetify);
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import MyPage from "./pages/MyPage.vue";
import TeamPage from "./pages/TeamPage.vue";
import SignIn from "./pages/SignIn.vue";
//import About from "./pages/About.vue";
//import Accounts from "./pages/Accounts.vue";

import VueRouter from "vue-router";

Vue.use(VueRouter);
const router = new VueRouter({
    mode: "history",
    routes: [
        {name: "my-page", path: "/my-page", component: MyPage},
        {name: "team-page", path: "/team-page", component: TeamPage},
        {name: "sign-in", path: "/", component: SignIn},
    ]
});

import App from "./App.vue";

new Vue({
    el: "#app",
    data: {
        currentUser: null
    },
    router,
    render: h => h(App)
});
