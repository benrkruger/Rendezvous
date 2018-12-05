<template>
    <div>
        <h4 class="display-1">Team Page</h4>

        <instructions details="Join and edit your teams here" />

        <v-form v-model="valid">
            <v-text-field
                v-model="joinName"
                v-bind:rules="rules.required"
                label="Join a team"
            ></v-text-field>
            <v-btn v-bind:disabled="!valid" v-on:click="handleJoin"
                >Join Team
            </v-btn>
        </v-form>

        <v-form v-model="valid">
            <v-text-field
                v-model="createName"
                v-bind:rules="rules.required"
                label="Create a team"
            ></v-text-field>
            <v-btn v-bind:disabled="!valid" v-on:click="handleCreate"
                >Create Team
            </v-btn>
        </v-form>

        <div class="text-xs-center">
            <v-dialog v-model="dialogVisible" width="500">
                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>
                        {{ dialogHeader }}
                    </v-card-title>

                    <v-card-text> {{ dialogText }} </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat v-on:click="hideDialog"
                            >Okay</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
import Instructions from "../components/Instructions.vue";
import axios from "axios";

export default {
    name: "TeamPage",
    components: {
        Instructions
    },
    data: function() {
        return {
            valid: false,
            joinName: "",
            createName: "",

            dialogHeader: "<no dialogHeader>",
            dialogText: "<no dialogText>",
            dialogVisible: false,

            rules: {
                required: [
                    val => val.length > 0 || 'Required'
                ],
                email: [
                    val => /^\w+@\w+\.\w{2,}$/.test(val) || "Invalid e-mail"
                ],
                password: [
                    val => /[A-Z]/.test(val) || "Need upper case letter",
                    val => /[a-z]/.test(val) || "Need lower case letter",
                    val => /\d/.test(val) || "Need digit",
                    val => val.length >= 8 || "Minimum 8 characters"
                ]
            }
        };
    },
    methods: {
        handleJoin: function() {
            axios
                .post("/api/memberteams/", this.joinTeam)
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
        },
        handleCreate: function() {
            axios
                .post("/api/team/", this.createName)
                .then (result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Created Team", result.data.msge);
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
        },
        showDialog: function(header, text) {
            this.dialogHeader = header;
            this.dialogText = text;
            this.dialogVisible = true;
        },
        hideDialog: function() {
            this.dialogVisible = false;
            this.$router.push({ name: "team-page" });
        }
    }
};
</script>
