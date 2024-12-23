<template>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center">{{ modalTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card class="ion-padding">
        <ion-card-header>
          <ion-card-title class="ion-text-center text-pink-darken-3">
            Add a Category
          </ion-card-title>
          <ion-card-subtitle
            class="ion-text-center ion-margin-bottom text-indigo-darken-1"
          >
            Use this form to create a Category.
          </ion-card-subtitle>
        </ion-card-header>
        <form @submit.prevent="createCategory">
          <ion-item>
            <ion-label>Category Type</ion-label>
            <ion-select
              v-model="form.category_type"
              interface="popover"
              placeholder="Select One"
            >
              <ion-select-option
                v-for="category in populate.category_type"
                :key="category"
                :value="category"
              >
                {{ category }}
              </ion-select-option>
            </ion-select>
          </ion-item> 

          <ion-item>
            <ion-label position="floating">Category Name</ion-label>
            <ion-input type="text" v-model="form.category_name"></ion-input>
          </ion-item>
          <ion-grid>
            <ion-row>
              <ion-col size="6">
                <ion-button expand="full" type="submit" color="primary"
                  >Submit</ion-button
                >
              </ion-col>
              <ion-col size="6">
                <ion-button expand="full" color="danger" @click="cancel"
                  >Close</ion-button
                >
              </ion-col>
            </ion-row>
          </ion-grid>
        </form>
      </ion-card>
    </ion-content>
  </template>
  
  <script setup>
  import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonItem,
    IonInput,
    modalController,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonGrid,
    IonCol,
    IonRow,
    IonCard,
    IonTextarea,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonDatetime
  } from "@ionic/vue";
  
  const cancel = () => modalController.dismiss(null, "cancel");
  const confirm = () => modalController.dismiss(name.value, "confirm");
  
  import { ref, reactive, onMounted, watch } from "vue";
  import axios from "axios";
  import { useTransactionsStore } from "../../stores/transactions";
  
  const name = ref();
  const apiURL = import.meta.env.VITE_API_BASE_URL;
  const modalTitle = ref("Create Category");

  const populate = reactive({
    category_type: ["Expense", "Income"],
  });
  
  const form = reactive({
    category_name: null,
    category_type: null,
  })

  const createCategory = () => {
    axios.post(`${apiURL}/api/category/create`, form)
    .then(() => {
        console.log('Category created successfully');
        window.location.href = '/categories';
      })
     .catch(error => {
        console.error(error);
      });
  }

  watch(()=> form, (newVal)=>{
    console.log(newVal);
  }, { deep: true})
  
  </script>
  