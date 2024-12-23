<template>
    <app-layout page-title="Accounts" page-default-back-link="/microfin">
    <ion-card>
            <ion-card-header color="light">
                <ion-card-subtitle color="primary">Accounts</ion-card-subtitle>
            </ion-card-header>
            <ion-list>
            <ion-item v-if="loading">Loading accounts...</ion-item>
            <ion-item 
            v-for="account in filteredAccounts" 
            :key="account.id"
            :router-link="'/account/' + account.id">
            <!-- <ion-icon :icon="icons[useTransactionsStore().catIcon(transaction.category_id)]" :color="useTransactionsStore().catIconColor(transaction.category_id)"></ion-icon> -->
            <ion-label class="ion-padding-start ellipsis-text" color="primary">
                <h2>{{ account.account_name }}</h2>
                <p>{{ account.account_type }}</p>
            </ion-label>
                <ion-label  color="primary">
                    <ion-item style="width:100%; --inner-border-width: 0;">
                        <ion-label class="ion-text-center">
                            <h2>&#x20B9 {{ account.account_amount }}</h2>
                        </ion-label>
                    </ion-item>
                </ion-label>
                <!-- <ion-label class="ion-text-right" color="danger">&#x20B9 {{ account.amount }}</ion-label> -->
            </ion-item>
        </ion-list>
        <ion-row style="justify-content: center; margin-bottom: 6px;">
                <ion-button @click="createAccount">+ Create Account</ion-button>
            </ion-row>
        </ion-card>
    </app-layout>
</template>

<script setup>
import { IonCard, onIonViewWillEnter, IonCardHeader, IonCardSubtitle, IonList, IonItem, IonLabel, menuController, IonButton, IonIcon, IonRow, modalController } from "@ionic/vue";
import * as icons from "ionicons/icons"
import { useTransactionsStore } from "../stores/transactions";
import AccountModal from '../components/base/AccountModal.vue';
import AppLayout from "../components/base/AppLayout.vue";
import { ref, watch, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from 'vue-router';
import { useToast } from "vue-toastification";

const route = useRoute();

const toast = useToast();

const transactionsStore = useTransactionsStore();
const { accounts, loading } = storeToRefs(transactionsStore);
let filteredAccounts = computed(() => accounts.value.filter(a => a.account_name !== "Unknown"));

onMounted(() => {
    transactionsStore.fetchAPIs(); 
    if(localStorage.getItem('accountCreated')){
        toast.success("Account Created Successfully!", {timeout: 3000});
        localStorage.removeItem('accountCreated');
    }
    if(localStorage.getItem('accountDeleted')){
        toast.success("Account Deleted Successfully!", {timeout: 3000});
        localStorage.removeItem('accountDeleted');
    }
});

// ====================== Open Budget Form Modal =====================
const createAccount = async() => {
    const accountModal = await modalController.create({
        component: AccountModal,
    });

    accountModal.present();

    const { data } = await accountModal.onWillDismiss();

    console.log(data);
  }
</script>

<style scoped>
.ion-margin-left {
    margin-left: 10px;
}

.ion-text-right {
    text-align: right;
}

.aligned-label {
    display: flex;
    align-items: center;
}

.ellipsis-text {
  display: block; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
  max-width: 100%; 
}
</style>