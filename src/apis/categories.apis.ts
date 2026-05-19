import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    categtroyDataSchema,
    type CategoryFormData,
    type CategoryFormDataEdit,
    type Category,
    type CategoryFormDataAdd,
} from "@/types/categories.interface.";


// * Get all active Categories
export async function getAllCategories() {
    try {
        const { data } = await api("/categories")
        const response = categtroyDataSchema.safeParse(data)
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get category by id
export async function getCategoryById({ id }: Pick<CategoryFormData, "id">) {
    try {
        const { data } = await api(`/categories/${id}`);
        const response = categtroyDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new category
export async function createCategory(formData: CategoryFormDataAdd) {
    try {
        const { data } = await api.post("/categories/createCategory", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type CategoryAPIType = {
    formData: CategoryFormDataEdit,
    categoryId: CategoryFormDataEdit["id"],
}

// * Updta category by id
export async function updateCategory({ categoryId, formData }: Pick<CategoryAPIType, "formData" | "categoryId">) {
    try {
        const { data } = await api.patch<string>(`/categories/updateCategory/${categoryId}`, formData);
        console.log(data);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Delete category by id
export async function deleteCategory(categoryId: Category["id"]) {
    try {
        const { data } = await api.delete<string>(`/categories/${categoryId}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}