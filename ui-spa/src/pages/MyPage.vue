<template>
    <section>
    <div>
        <h4 class="display-1">My Page</h4>

        <instructions details="Update commitments, change your core hours, or vote on pending activities." />

        <v-btn id="commitmentsBtn" v-on:click='initCommitments' color='info'>Commitments</v-btn>
        
        <v-btn id="coreHrsBtn" v-on:click='initCoreHrs' color='info'>Change Core Hours</v-btn>

        <v-btn id="pendingBtn" v-on:click='initVote' color='info'>Pending Activities</v-btn>

        <div id="divCommitments" hidden=true>
            <p></p>
            <h2>Add a Commitment</h2>
            <p></p>
            <p>Enter the details of your commitment.</p>
            
            <v-text-field 
                id="name" 
                v-model="name"
                label="Name of Commitment"
            ></v-text-field>

            <v-text-field 
                id="date" 
                v-model="date"
                label="Date (MM/DD/YY)"
            ></v-text-field>
            
            <v-text-field 
                id="starttime" 
                v-model="starttime"
                label="Start Time (HH:MM AM/PM)"
            ></v-text-field>
            
            <v-text-field 
                id="endtime" 
                v-model="endtime"
                label="End Time (HH:MM AM/PM)"
            ></v-text-field>

            <v-btn id="addCommitment" v-on:click="submitCommitment" color='info'>Submit</v-btn>
            <v-btn id="addCommitment" v-on:click="showCommitments">Refresh</v-btn>
            <p></p>
            <commitBox 
                commitName="Pizza party" 
                date="12/23/2018" 
                startTime="5:30 PM" 
                endTime="10:00 PM"/>

            <div id="myCommitments">
                <div v-for="commitment in commitments" :key="commitment">
                    <commit-box
                    v-bind:commitName="commitment.name" 
                    v-bind:date="commitment.date" 
                    v-bind:startTime="commitment.starttime" 
                    v-bind:endTime="commitment.endtime"/>   
                </div>               
            </div>
        </div>

        <div id="divCoreHrs" hidden=true>
            <p></p>
            <h1 v-for="user in coreHours" :key="user">Start: {{user.corestart}}</h1>
            <h1 v-for="user in coreHours" :key="user">Start: {{user.coreend}}</h1>
            <p></p>
            <p></p>
            <h3>Change Core Hours</h3>
            <v-text-field 
                id="newStartTime" 
                v-model="newCoreStart"
                label="New Start Time"
            ></v-text-field>

            <v-text-field 
                id="newEndTime" 
                v-model="newCoreEnd"
                label="New End Time"
            ></v-text-field>

            <v-btn id="changeHours" v-on:click='handleChangeHrs' color='info'>Save changes</v-btn>

        </div>

        <div id="divVote" hidden=true>
            <h2>Vote on Pending Activities</h2>
            <activity-box activityName="COS 243 Presentation" location="Euler 109" date="12/7/2018" startTime="1:00 PM" endTime="1:50 PM"/>

            <div id="myActivities">
                <div v-for="activity in activities" :key="activity">
                    <commit-box
                    v-bind:activityName="activity.name" 
                    v-bind:location="activity.location"
                    v-bind:date="activity.date" 
                    v-bind:startTime="activity.starttime" 
                    v-bind:endTime="activity.endtime"/>   
                </div>               
            </div>
        </div>

    </div>
    </section>
</template>

<!-- Script copied from SignIn.vue to change to fit this page -->
<script>
import Instructions from "../components/Instructions.vue";
import CommitBox from "../components/CommitBox.vue";
import ActivityBox from "../components/ActivityBox.vue";
import axios from "axios";

export default {
    name: "MyPage",
    components: {
        Instructions,
        CommitBox,
        ActivityBox
    },
    data: function() {
        return {
            valid: false,

            dialogHeader: "<no dialogHeader>",
            dialogText: "<no dialogText>",
            dialogVisible: false,
            commitments: new Array(),
            activities: new Array(),
            coreHours: new Array(),
            /*rules: {
                required: [
                    val => val.length > 0 || 'Required'
                ],
                newCommitmentDate: [
                    val => /^\d{2}/.test(val) || "Invalid date"
                ],
                newCommitmentStartTime: [
                    val => /[A-Z]/.test(val) || "Need upper case letter",
                    val => /[a-z]/.test(val) || "Need lower case letter",
                    val => /\d/.test(val) || "Need digit",
                    val => val.length >= 8 || "Minimum 8 characters"
                ],
                confirm: [
                    val => val==this.newPassword || "Must match New Password"
                ]
            }*/
        };
    },
    methods: {
        showCommitments: function() {
            axios
                .post("/api/commitments/",{
                    email: this.$root.currentUser,
                    name: "null",
                    starttime: "null",
                    endtime: "null",
                    date: "null",
                })
                .then (result => {
                    this.commitments = result.data;
                })
                .catch(err => this.showDialog("Failed", err));
        },
        initCommitments: function() {
            divCommitments.hidden=false
            divVote.hidden=true
            divCoreHrs.hidden=true
        },
        submitCommitment: function() {
            axios
                .post("/api/commitments/",{
                    email: this.$root.currentUser,
                    name: this.name,
                    starttime: this.starttime,
                    endtime: this.endtime,
                    date: this.date,
                })
                .then (result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Created Commitment", result.data.msge);
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
        },
        initVote: function() {
            divCommitments.hidden=true
            divVote.hidden=false
            divCoreHrs.hidden=true
        },
        initCoreHrs: function() {
            divCommitments.hidden=true
            divVote.hidden=true
            divCoreHrs.hidden=false
        },
        handleChangeHrs: function() {
            axios
                .post("/api/member/",{
                    email: this.$root.currentUser,
                    password: "null",
                    coreStart: this.newCoreStart,
                    coreEnd: this.newCoreEnd,
                })
                .then (result => {
                    this.coreHours=result.data;
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
            if (this.dialogHeader=="Success"){
                this.$router.push({ name: "my-page" });
            }
            else{
                this.$router.push({ name: "my-page" });
            }
        }
    },
    beforeMount() {
        this.showCommitments()
    }
};
</script>
