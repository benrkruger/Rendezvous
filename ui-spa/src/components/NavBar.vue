<template>
    <v-toolbar dark color="primary">
        <v-toolbar-side-icon></v-toolbar-side-icon>

        <v-toolbar-title class="white--text">
            Rendezvous
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn flat v-bind:to="{ name: 'team-page' }" id="teambtn">Team Page</v-btn>

        <v-btn flat v-bind:to="{ name: 'my-page' }" id="mybtn">My Page</v-btn>

        <!--<v-menu offset-y>
            <v-btn flat slot="activator">
                <span>Admin</span>
                <v-icon dark>arrow_drop_down</v-icon>
            </v-btn>

            <v-list>
                <v-list-tile v-bind:to="{ name: 'accounts' }">
                    <v-list-tile-title>Accounts</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>-->
    </v-toolbar>

</template>
