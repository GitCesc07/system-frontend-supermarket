import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    expiredProductsDataSchema,
    type ExpiredProductsFormData,
    type ExpiredProductsFormDataInfo,
    type ExpiredProducts,
    type ExpiredProductsFormDataAdd,
} from "@/types/expiredProducts.interface";

// * Get all expired products
export async function getDamagedProducts() {
    try {
        const { data } = await api("/damagedProducts");
        const response = expiredProductsDataSchema.safeParse(data)
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get expired products by id
export async function getDamagedProductsById({ id }: Pick<ExpiredProductsFormData, "id">) {
    try {
        const { data } = await api(`/damagedProducts/${id}`);
        const response = expiredProductsDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new expired products
export async function createDamagedProducts(formData: ExpiredProductsFormDataAdd) {
    try {
        const { data } = await api.post("/damagedProducts/createDamagedProducts", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type ExpiredProductsAPIType = {
    formData: ExpiredProductsFormDataInfo,
    expiredProductsId: ExpiredProductsFormDataInfo["id"],
}

// * Updta expired products by id
export async function updateDamagedProducts({ expiredProductsId, formData }: Pick<ExpiredProductsAPIType, "expiredProductsId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/damagedProducts/updateDamagedProducts/${expiredProductsId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Delete expired products by id
export async function deleteDamagedProducts(expiredProducts: ExpiredProducts["id"]) {
    try {
        const { data } = await api.delete<string>(`/damagedProducts/${expiredProducts}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}