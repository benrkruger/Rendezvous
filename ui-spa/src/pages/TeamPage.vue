<template>
    <div>
        <h4 class="display-1">Team Page</h4>

        <instructions details="Join and edit your teams here" />

        <v-form v-model="valid">
            <v-text-field
                v-model="teamName"
                v-bind:rules="rules.required"
                label="Join or Create a team"
            ></v-text-field>
            <v-btn 
                v-bind:disabled="!valid" 
                v-on:click="handleJoin"
                color='info'
            >Join Team</v-btn>
            <v-btn 
                v-bind:disabled="!valid" 
                v-on:click="handleCreate"
            >Create Team</v-btn>
        </v-form>

        <p></p>
        <h2>My Teams</h2>
        <v-btn id="showTeams" v-on:click="showTeams" color='info'>Refresh</v-btn>
        <div id='myTeams'>
            <!--{{ teams }}-->
            <team-box v-for="team in teams" :key="team" :TeamName="team.teamname" nextAct="This is where the next activity should be"/>
        </div>

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
                        <v-btn color="primary" flat v-on:click="hideDialog">Okay</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
import Instructions from "../components/Instructions.vue";
import TeamBox from "../components/TeamBox.vue";
import axios from "axios";

export default {
    name: "TeamPage",
    components: {
        Instructions,
        TeamBox
    },
    data: function() {
        return {
            valid: false,
            teamName: "",


            dialogHeader: "<no dialogHeader>",
            dialogText: "<no dialogText>",
            dialogVisible: false,

            teams: new Array(),

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
                .post("/api/memberteams/", {
                    teamName: this.teamName,
                    email: this.$root.currentUser,
                })
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
                .post("/api/team/", {teamName: this.teamName})
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
        },
        showTeams: function() {
            //old code: myTeams.append(<team-box TeamName="Poop" nextAct="Today"/>)
            //document.getElementById('myTeams').innerHTML+='<team-box TeamName="Poop" nextAct="activity"/>';
            axios
                .post("/api/memberteams/",{
                    teamName: "null",
                    email: this.$root.currentUser,
                })
                .then (result => {
                    this.teams = result.data;

                })
                .catch(err => this.showDialog("Failed", err));
        }
    },
    beforeMount() {
        this.showTeams()
    }
};
</script>
