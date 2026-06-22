import { isAxiosError } from "axios";
import api from "../lib/axios";
import { queryDataSchema, queryDataSchemaChart } from "../types/querysInitial.interface";

// * Get all information initial system
export async function getDataInitial() {
    try {
        const { data } = await api("/dataInitial")
        const response = queryDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// *  Get all information initial system chart
export async function getDataInitialChartBuysAndSales() {
    try {
        const { data } = await api("/querysCharts")
        const response = queryDataSchemaChart.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}
