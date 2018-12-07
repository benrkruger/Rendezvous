<template>
    <v-card>
        <v-card-title primary-title>
            <h3 class='headline mb-0'>{{ commitName }}</h3>
        </v-card-title>

        <v-card-text>Date: {{ date }}</v-card-text>
        <v-card-text>From {{startTime}} to {{endTime}}</v-card-text>
           
    </v-card>
</template>

<script>
export default {
    props: ["commitName", "startTime", "endTime", "date"]
};
</script>