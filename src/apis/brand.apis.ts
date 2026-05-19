import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    brandDataSchema,
    type BrandFormData,
    type BrandFormDataEdit,
    type Brand,
    type BrandFormDataAdd,    
} from "@/types/brand.interface";

// * Get all brands
export async function getBrands() {
    try {
        const { data } = await api("/brands");
        const response = brandDataSchema.safeParse(data)
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get brand by id
export async function getBrandById({ id }: Pick<BrandFormData, "id">) {
    try {
        const { data } = await api(`/brands/${id}`);
        const response = brandDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new brand
export async function createBrand(formData: BrandFormDataAdd) {
    try {
        const { data } = await api.post("/brands/createBrand", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type BrandAPIType = {
    formData: BrandFormDataEdit,
    brandId: BrandFormDataEdit["id"],
}

// * Updta brand by id
export async function updateBrand({ brandId, formData }: Pick<BrandAPIType, "brandId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/brands/updateBrand/${brandId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Delete brand by id
export async function deleteBrand(brandId: Brand["id"]) {
    try {
        const { data } = await api.delete<string>(`/brands/${brandId}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}