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
export async function getExpiredProducts() {
    try {
        const { data } = await api("/expiredProducts");
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
export async function getExpiredProductsById({ id }: Pick<ExpiredProductsFormData, "id">) {
    try {
        const { data } = await api(`/expiredProducts/${id}`);
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
export async function createExpiredProducts(formData: ExpiredProductsFormDataAdd) {
    try {
        const { data } = await api.post("/expiredProducts/createExpiredProducts", formData);
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
export async function updateExpiredProducts({ expiredProductsId, formData }: Pick<ExpiredProductsAPIType, "expiredProductsId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/expiredProducts/updateExpiredProducts/${expiredProductsId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Delete expired products by id
export async function deleteExpiredProducts(expiredProducts: ExpiredProducts["id"]) {
    try {
        const { data } = await api.delete<string>(`/expiredProducts/${expiredProducts}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}