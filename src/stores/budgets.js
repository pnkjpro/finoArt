import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useTransactionsStore } from "./transactions";


export const useBudgetStore = defineStore('budgets', () => {

    const transactionsStore = ref([]);
    transactionsStore.value = useTransactionsStore();
    const { transactions } = storeToRefs(transactionsStore.value);

    const netSpends = (categoryName) => {
        return transactions.value
            .filter(t => t.category_name === categoryName)
            .reduce((acc, t) => acc + t.amount, 0)
    }
    
    const progressValue = (categoryName, budgetAmount) => {
        const netSpend = netSpends(categoryName);
        return (netSpend / budgetAmount);
    }
    
    const progressColor = (categoryName, budgetAmount) => { 
        const progress = progressValue(categoryName, budgetAmount)
    
        if (progress < 0.5) {
            return '#32CD32'; // Green for less than 50%
          } else if (progress < 0.75) {
            return '#FFA500'; // Orange for 50-75%
          } else {
            return '#FF0000'; // Red for 75% and above
          }
    }

    return { netSpends, progressValue, progressColor };
});