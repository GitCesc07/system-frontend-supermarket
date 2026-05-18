import { isAxiosError } from "axios";
import api from "../lib/axios";
import { 
    supplierDataSchema,     
    type Supplier, 
    type SupplierFormDataAdd, 
    type SupplierFormDataEdit, 
    type SupplierFormDataInfo 
} from "@/types/suppliers.interface";

// * Get all suppliers
export async function getSupplierPagination() {
    try {
        const { data } = await api("/suppliers/");
        const response = supplierDataSchema.safeParse(data)
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get all active suppliers
export async function getAllActiveSupplier() {
    try {
        const { data } = await api("/suppliers/activeSuppliers")
        const response = supplierDataSchema.safeParse(data)
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get supplier by id
export async function getSupplierById({ id }: Pick<SupplierFormDataInfo, "id">) {
    try {
        const { data } = await api(`/suppliers/${id}`);
        const response = supplierDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new supplier
export async function createSupplier(formData: SupplierFormDataAdd) {
    try {
        const { data } = await api.post("/suppliers/createSupplier", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type SupplierAPIType = {
    formData: SupplierFormDataEdit,
    supplierId: SupplierFormDataEdit["id"],
}

// * Updta supplier by id
export async function updateSupplier({ supplierId, formData }: Pick<SupplierAPIType, "supplierId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/suppliers/updateSupplier/${supplierId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Delete supplier by id
export async function deleteSupplier(supplierId: Supplier["id"]) {
    try {
        const { data } = await api.delete<string>(`/suppliers/${supplierId}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}