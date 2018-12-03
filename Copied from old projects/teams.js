console.log("Loaded team page logic");

// Define components _before_ creating the Vue object.
Vue.component('teams-static-heading', {
    template: '<h2>Fancier Sign-Up Page</h2>'
});

Vue.component('instructions', {
    props: ['details'],
    template: '<p><strong>Instructions</strong>: {{ details }}</p>'
});

Vue.component('error-msge', {
    props: ['msge', 'severity'],
    template: `<div class="alert" v-bind:class="'alert-' + severity">{{ msge }}</div>`
});

// Control...     If true   If false
// ----------------------------------
// Been visited   touched   untouched
// Has changed	  dirty     pristine
// Is valid       valid     invalid

// Create a new Vue object attached to the sign-up form.
let joinTeam = new Vue({
    el: '#teams-page',
    data: {
        text: ''
    },
    computed: {
        errors: function () {
            let messages = [];
            if (!this.email.length) {
                messages.push({
                    severity: 'danger',
                    msge: 'Team name must not be empty'
                })
            } /*else if (Team exists in database) {

            }*/
            return messages;
        }
    }
});