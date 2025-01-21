<template>
    <app-layout page-title="Update Party" page-default-back-link="/microfin">
    <ion-card>
            <ion-card-header color="light">
                <ion-card-subtitle>Edit Party</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
                <ion-list>
                    <ion-item>
                        <ion-label class="ion-text-center" color="primary">
                            <h2>{{ party.party_name }}</h2>
                        </ion-label>   
                    </ion-item>
                    <ion-list v-for="transaction in party.transactions" style="width:100%; --inner-border-width: 0;">
                            <ion-item :router-link="'/transaction/' + transaction.id">
                                <ion-label><h2>{{transaction.category_name }}</h2><p>{{ transaction.description }}</p></ion-label>
                                <ion-label><h2>&#x20B9 {{transaction.amount }}</h2><p>{{ formatDate(transaction.created_at) }}</p></ion-label>
                                    <ion-icon size="large" color="warning" :icon="icons.createOutline"></ion-icon>
                            </ion-item>
                            
                        </ion-list>
                        <ion-item>
                            <ion-label>Total</ion-label>
                            <ion-label :color="party.net_amount > 0 ? 'success' : 'danger'"><h2>&#x20B9 {{ party.net_amount  }}</h2></ion-label>
                        </ion-item>
                    <ion-item style="width:100%; --inner-border-width: 0;">
                        <ion-label @click="deleteParty">
                            <ion-button expand="block" color="danger">
                                <ion-icon :icon="icons.trashBinOutline"></ion-icon> &nbsp; Delete Party
                            </ion-button>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </ion-card-content>
        </ion-card>
    </app-layout>
    </template>
    
    <script setup>
    import { storeToRefs } from "pinia";
    import {
      IonList,
      IonItem,
      IonLabel,
      IonImg,
      IonThumbnail,
      IonRow,
      IonCol,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonTabButton,
      IonCardSubtitle,
      IonCardContent,
      IonProgressBar,
      IonInput,
      IonButton,
      IonIcon,
      IonFab,
      IonFabButton,
      IonFabList,
      modalController,
      IonDatetime,
    } from "@ionic/vue";
    import { useRoute } from "vue-router";
    import { ref, reactive, computed, watch, onMounted } from "vue";
import { useTransactionsStore } from "../stores/transactions";
import * as icons from "ionicons/icons";
import AppLayout from "../components/base/AppLayout.vue";
import { useToast } from "vue-toastification";

import axios from "axios";
import { format } from "date-fns";


    const toast = useToast();
    const route = useRoute();
    const apiURL = import.meta.env.VITE_API_BASE_URL;
    const partyId = parseInt(route.params.id);
    const isEditable = ref(false);
    
    const transactionsStore = useTransactionsStore();
    const { parties, transactions } = storeToRefs(transactionsStore);
    
    const party =  computed(() => parties.value.find(p => p.id === partyId));
    const partyTransactions = computed(() => transactions.value.filter(t => t.party_id === partyId))

    const totals = computed(() => {
    return partyTransactions.value.reduce((acc, t) => {
        if (t.category_name === "Taken") {
        acc.taken += t.amount;
        } else if (t.category_name === "Given") {
        acc.given += t.amount;
        }
        return acc;
    }, { taken: 0, given: 0 });
    });

const form = reactive({
    partyId: partyId,
    taken: 0,
    given: 0,
})

const formatDate = (date) => {
    return format(new Date(date), 'dd-MMM yyyy');
}

    const deleteParty = () => {
    if (confirm("Are you sure you want to delete this Party?")) {
        axios.delete(`${apiURL}/api/party/delete/${partyId}`) 
        .then(() => {  
            localStorage.setItem("partyDeleted", true);
            window.location.href = '/parties';
        })
        .catch(error => {
            toast.error("Error Deleting Party", { timeout: 5000 });
            console.error(error);
        });
    } else {
        toast.error("User Cancelled to delete this Party", { timeout: 5000 });
        console.log("User Cancelled to delete this Party");
        return;
    }
}
</script>
    
<style scoped></style>