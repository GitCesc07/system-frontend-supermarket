import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    type SalesData,
    type SalesFormDataAdd,
    salesFormDataSchema,
    tempPurchasingDetailsDataSchema,
} from "../types/sales.interface";

// * Get all sales

export async function getSales() {
    try {
        const { data } = await api("/sales")
        const response = salesFormDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Get sales by id
export async function getDetailsSalesById({ id }: Pick<SalesData, "id">) {
    try {
        const { data } = await api(`/sales/${id}`);
        const response = tempPurchasingDetailsDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Create a new sales
export async function createSales(formData: SalesFormDataAdd) {
    try {
        const { data } = await api.post("/sales/createSales", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}