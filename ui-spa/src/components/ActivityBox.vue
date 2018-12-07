<template>
    <v-card>
        <v-card-title primary-title>
            <h3 class='headline mb-0'>{{ activityName }} at {{ location }} on {{ date }} from {{startTime}} to {{endTime}} </h3>
        </v-card-title>
        <v-btn flat color='green'>Approve</v-btn>
        <v-btn flat color='red'>Reject</v-btn>
    </v-card>
</template>

<script>
export default {
    props: ["activityName", "location", "startTime", "endTime", "date"]
};
</script>