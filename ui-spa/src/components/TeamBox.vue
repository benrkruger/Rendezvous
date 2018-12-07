<template>
    <v-card>
        <v-card-title primary-title>
            <h3 class='headline mb-0'>{{ TeamName }}</h3>
        </v-card-title>

        <v-card-text>Next Activity: {{ nextAct }}</v-card-text>

        <v-card-actions>
            <v-btn flat color='blue'>Schedule Activities</v-btn>
            <v-btn flat color='blue'>Pending Activities</v-btn>
            <!--<v-btn flat color='red'>Leave Team</v-btn>-->
        </v-card-actions>                
    </v-card>
</template>

<script>
export default {
    props: ["TeamName", "nextAct"]
};
</script>