console.log("Loaded reset logic");

// Define components _before_ creating the Vue object.
Vue.component('reset-password-static-heading', {
    template: '<h2>Fancier Password Reset Page</h2>'
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
let signUp = new Vue({
    el: '#reset-password-page',
    data: {
        password: '',
        newpassword: '',
        confirmnew: ''
    },
    computed: {
        errors: function () {
            let messages = [];

            messages = messages
                .concat(checkValidity(this.password,'Password'))
                .concat(checkValidity(this.newpassword,'New Password'))
                .concat(checkValidity(this.confirmnew,'Confirm New Password'))
                .concat(similar(this.newpassword,this.confirmnew))

            return messages;
        }
    }
});

function checkValidity (field,place) {
    let messages = []

    if (!field.length) {
        messages.push({
            severity: 'danger',
            msge: (place+' field must not be empty')
        })
    } else {
        if (!field.match(/[A-Z]/)) {
            messages.push({
                severity: 'warning',
                msge: (place+' field requires at least one upper-case letter')
            });
        }

        if (!field.match(/[a-z]/)) {
            messages.push({
                severity: 'warning',
                msge: (place+' field requires at least one lower-case letter')
            });
        }

        if (!field.match(/[0-9]/)) {
            messages.push({
                severity: 'warning',
                msge: (place+' field requires at least one digit')
            });
        }

        if (field.length < 8) {
            messages.push({
                severity: 'danger',
                msge: (place+' field must be at least eight characters long')
            });
        }
    }
    return messages;
}

function similar(newpassword,confirmnew){
    let messages = []
    if (newpassword!==confirmnew) {
        messages.push({
            severity: 'danger',
            msge: 'New Password and Confirm New Password fields must match.'
        })
    }
    return messages;
}
