import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    customerDataSchema,
    type Customer,
    type CustomerFormData,
    type CustomerFormDataAdd,
    type CustomerFormDataEdit
} from "../types/customers.interface";

// * Get all customers
export async function getCustomers() {
    try {
        const { data } = await api("/customers")
        const response = customerDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}

// * Get all active clients
export async function getAllActiveClients() {
    try {
        const { data } = await api("/customers/activeClients")
        const response = customerDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}

// * Get customer by id
export async function getCustomerById({ id }: Pick<CustomerFormData, "id">) {
    try {
        const { data } = await api(`/customers/${id}`);
        const response = customerDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}

// * Create a new customer
export async function createCustomer(formData: CustomerFormDataAdd) {
    try {
        const { data } = await api.post("/customers/createCustomer", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}

type CustomerAPIType = {
    formData: CustomerFormDataEdit,
    customerId: CustomerFormDataEdit["id"],
}

// * Update customer by id
export async function updateCustomer({ customerId, formData }: Pick<CustomerAPIType, "customerId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/customers/updateCustomer/${customerId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}

// * Delete customer by id
export async function deleteCustomer(customerId: Customer["id"]) {
    try {
        const { data } = await api.delete<string>(`/customers/${customerId}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}