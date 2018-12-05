<template>
    <section>
    <div>
        <h4 class="display-1">My Page</h4>

        <instructions details="Update commitments, change your core hours, or vote on pending activities." />

        <div id="divCommitments" hidden=true>
            <h2>Update Commitments</h2>
            
            <v-text-field 
                id="newCommitmentName" 
                v-model="text"
                label="Name"
            ></v-text-field>

            <v-text-field 
                id="newCommitmentDate" 
                v-model="text"
                label="Date"
            ></v-text-field>
            
            <v-text-field 
                id="newCommitmentStart" 
                v-model="text"
                label="Start Time"
            ></v-text-field>
            
            <v-text-field 
                id="newCommitmentEnd" 
                v-model="text"
                label="End Time"
            ></v-text-field>
        </div>

        <div id="divCoreHrs" hidden=true>
            <h2>Core Hours</h2>
        </div>

        <div id="divVote" hidden=true>
            <h2>Vote on Pending Activities</h2>
        </div>


        <v-btn id="commitmentsBtn" v-on:click='initCommitments'>Update Commitments</v-btn>
        
        <v-btn id="coreHrsBtn" v-on:click='initCoreHrs'>Change Core Hours</v-btn>

        <v-btn id="pendingBtn" v-on:click='initVote'>Pending Activities</v-btn>

    </div>
    </section>
</template>

<!-- Script copied from SignIn.vue to change to fit this page -->
<script>
import Instructions from "../components/Instructions.vue";
import axios from "axios";

export default {
    name: "MyPage",
    components: {
        Instructions
    },
    data: function() {
        return {
            valid: false,

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
                ],
                confirm: [
                    val => val==this.newPassword || "Must match New Password"
                ]
            }
        };
    },
    methods: {
        initCommitments: function() {
            divCommitments.hidden=false
            divVote.hidden=true
            divCoreHrs.hidden=true
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
                this.$router.push({ name: "sign-in" });
            }
        }
    }
};
</script>
