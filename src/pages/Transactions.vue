<template>
    <app-layout page-title="Transactions" page-default-back-link="/microfin">
        <ion-card>
            <ion-card-header color="light">
                <ion-card-subtitle v-if="selectedTransactionType != 'Loans & Advances'" color="primary">Monthly {{ selectedTransactionType }} Transactions &#x20B9{{ totals }}</ion-card-subtitle>
                <ion-card-subtitle 
                v-if="(selected_SubExp_TransactionType != 'Select Expense Transaction Type') && (selectedTransactionType === 'Expense')" color="primary">
                Monthly {{ selected_SubExp_TransactionType }} Transactions &#x20B9{{ expCatTotal }}
            </ion-card-subtitle>
            <ion-card-subtitle v-if="(selectedTransactionType != 'Loans & Advances') && (selectedDate)" color="primary">Filtered {{ selectedTransactionType }} Transactions &#x20B9{{ filteredIncomeTransactions }}</ion-card-subtitle>

            </ion-card-header>
            <ion-card-header color="light">
                <ion-card-subtitle color="primary">
                    <!-- ======================== main filter ============================ -->
                    <div class="">
                        <div class="flex justify-between items-center space-x-2">
                            <div class="relative">
                                <form
                                    class="bg-white text-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                                    <ion-select v-model="selectedTransactionType" interface="popover" placeholder="Expense"
                                        class="absolute inset-0 w-full h-full opacity-0">
                                        <ion-select-option value="Expense">Expense</ion-select-option>
                                        <ion-select-option value="Income">Income</ion-select-option>
                                        <ion-select-option value="Loans & Advances">Loan & Advances</ion-select-option>
                                    </ion-select>
                                    <span v-text="selectedTransactionType || 'Expense'"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </form>
                            </div>

                            <div class="relative w-full max-w-[150px]">
                                <div
                                    class="bg-white text-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between w-full">
                                    <span>{{ sortLabel }}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <ion-select v-model="selectedSortOption" interface="popover" placeholder="Sort By"
                                        class="absolute inset-0 w-full h-full opacity-0">
                                        <ion-select-option value="created_asc">Oldest First</ion-select-option>
                                        <ion-select-option value="created_desc">Newest First</ion-select-option>
                                        <ion-select-option value="amount_asc">Low to High</ion-select-option>
                                        <ion-select-option value="amount_desc">High to Low</ion-select-option>
                                    </ion-select>
                                </div>
                            </div>

                            <div class="relative">
                                <div 
                                    @click="showDatePicker = true"
                                    class="bg-white text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                                    :class="{ 'bg-primary text-white': selectedDate }"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <!-- Date Picker Modal -->
                                <ion-modal :is-open="showDatePicker" @didDismiss="showDatePicker = false">
                                    <ion-header>
                                        <ion-toolbar>
                                            <ion-title>Select Date</ion-title>
                                            <ion-buttons slot="end">
                                                <ion-button @click="showDatePicker = false">Close</ion-button>
                                            </ion-buttons>
                                        </ion-toolbar>
                                    </ion-header>
                                    <ion-content>
                                        <ion-datetime
                                            presentation="date"
                                            v-model="selectedDate"
                                            @ionChange="handleDateChange"
                                        ></ion-datetime>
                                        <div class="p-4">
                                            <ion-button expand="block" @click="clearDateFilter">Clear Filter</ion-button>
                                        </div>
                                    </ion-content>
                                </ion-modal>
                            </div>
                        </div>
                    </div>

                    <!-- ======================== sub filter ============================ -->
                    <!-- write your code here -->
                    <div v-if="selectedTransactionType == 'Expense'" class="mt-2">
                        <div class="relative">
                                <form
                                    class="bg-white text-gray-800 px-3 py-2 rounded-md text-sm font-medium custom-center">
                                    <ion-select v-model="selected_SubExp_TransactionType" interface="popover" placeholder="Expense"
                                        class="absolute inset-0 w-full h-full opacity-0">
                                        <ion-select-option v-for="category in Object.keys(expCat_totals)" :value="category">{{ category }}</ion-select-option>
                                    </ion-select>
                                    <span v-text="selected_SubExp_TransactionType || 'Snacks'"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </form>
                            </div>
                    </div>
                     <!-- ======================= sub filter ends here ================== -->
                </ion-card-subtitle>
            </ion-card-header>
            <ion-list>
                <ion-item v-if="loading">Loading transactions...</ion-item>
                <ion-item v-for="transaction in filteredAndSortedTransactions" :key="transaction.id"
                    :router-link="'/transaction/' + transaction.id">
                    <ion-icon :icon="icons[useTransactionsStore().catIcon(transaction.category_id)]"
                        :color="useTransactionsStore().catIconColor(transaction.category_id)"></ion-icon>
                    <ion-label v-if="transaction.transaction_type == 'Loans & Advances'" class="ion-padding-start ellipsis-text" color="primary">
                        <h2>{{ displayParty(transaction.party_id) }}</h2>
                        <p>{{ transaction.description }}</p>
                        <p>{{ transaction.category_name }}</p>
                    </ion-label>
                    <ion-label v-else class="ion-padding-start ellipsis-text" color="primary">
                        <h2>{{ transaction.description }}</h2>
                        <p>{{ transaction.category_name }}</p>
                    </ion-label>
                    <ion-label color="primary">
                        <ion-item style="width:100%; --inner-border-width: 0;">
                            <ion-label class="ion-text-center">
                                <h2>&#x20B9 {{ transaction.amount }}</h2>
                                <p>{{ useTransactionsStore().formatDateTime(transaction.created_at) }}</p>
                            </ion-label>
                        </ion-item>
                    </ion-label>
                    <!-- <ion-label class="ion-text-right" color="danger">&#x20B9 {{ transaction.amount }}</ion-label> -->
                </ion-item>
            </ion-list>
        </ion-card>
    </app-layout>
</template>

<script setup>
import { IonCard, IonCardHeader, IonCardSubtitle, IonList, IonItem, IonLabel, IonButton, IonIcon, IonSelect, IonSelectOption, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonDatetime, IonRefresher, IonRefresherContent } from "@ionic/vue";
import * as icons from "ionicons/icons"
import { useTransactionsStore } from "../stores/transactions";
import { ref, watch, onMounted, computed, reactive } from "vue";
import AppLayout from "../components/base/AppLayout.vue";
import { useToast } from "vue-toastification";

import { storeToRefs } from "pinia";

const toast = useToast();
const transactionsStore = useTransactionsStore();
const { transactions, expCat_totals, loading, exp_categories, error } = storeToRefs(transactionsStore);

const showDatePicker = ref(false);
const selectedDate = ref(null);
const selectedTransactionType = ref("Expense");
const selected_SubExp_TransactionType = ref("Select Expense Transaction Type");
const selectedSortOption = ref("created_desc");


const displayParty = (partyId) => {
    const party = useTransactionsStore().parties.find(party => party.id == partyId);
    return party ? party.party_name : "Unknown";
}


const handleDateChange = (event) => {
    selectedDate.value = event.detail.value;
    showDatePicker.value = false;
};

const clearDateFilter = () => {
    selectedDate.value = null;
    showDatePicker.value = false;
};

const filteredAndSortedTransactions = computed(() => {
    // Filter transactions based on selected transaction type
    let filtered = transactions.value.filter(t => t.transaction_type === selectedTransactionType.value);

    if(selectedTransactionType.value === "Expense" && selected_SubExp_TransactionType.value != "Select Expense Transaction Type") {
        filtered = filtered.filter(t => t.category_name === selected_SubExp_TransactionType.value);
    }


    // Then filter by date if selected
    if (selectedDate.value) {
        const selectedDateStart = new Date(selectedDate.value);
        selectedDateStart.setHours(0, 0, 0, 0);
        
        const selectedDateEnd = new Date(selectedDate.value);
        selectedDateEnd.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter(t => {
            const transactionDate = new Date(t.created_at);
            return transactionDate >= selectedDateStart && transactionDate <= selectedDateEnd;
        });
    }

    //Then sort based on the selected option
    switch(selectedSortOption.value) {
        case "amount_asc":
            return filtered.sort((a,b) => a.amount - b.amount);
        case "amount_desc":
            return filtered.sort((a,b) => b.amount - a.amount);
        case "created_asc":
            return filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
        case "created_desc":
        default:
            return filtered.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }
});

const sortLabel = computed(() => {
    switch(selectedSortOption.value){
        case "amount_asc":
            return "Low to High";
        case "amount_desc":
            return "High to Low";
        case "created_asc":
            return "Oldest First";
        case "created_desc":
        default:
            return "Newest First";
    }
});


// const exp_transactions = computed(() => transactions.value.filter(t => t.transaction_type === "Expense"));
const filteredIncomeTransactions = computed(() => filteredAndSortedTransactions.value.reduce((total, t) => total + (t.transaction_type === selectedTransactionType.value ? t.amount : 0), 0));
const totals = computed(() => transactions.value.reduce((total, t) => total + (t.transaction_type === selectedTransactionType.value ? t.amount : 0), 0));

const expCatTotal = computed(
    () => {
        return expCat_totals.value[selected_SubExp_TransactionType.value] || 0;
    });

watch(()=>selectedTransactionType, (newVal, oldVal) =>{
    // transactionsStore.setTransactionType(newVal);
    console.log(newVal);
})

onMounted(() => {
    transactionsStore.fetchAPIs();
    if (localStorage.getItem('transactionDeleted')) {
        toast.success("Transaction Deleted Successfully!");
        localStorage.removeItem('transactionDeleted');
    }
    if (localStorage.getItem('transactionUpdated')) {
        toast.success("Transaction Updated Successfully!");
        localStorage.removeItem('transactionUpdated');
    }
    if (localStorage.getItem('transactionCreated')) {
        toast.success("Transaction Created Successfully!");
        localStorage.removeItem('transactionCreated');
    }
});
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
    /* Adds the ellipsis (...) */
    max-width: 100%;
}

.custom-center {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>