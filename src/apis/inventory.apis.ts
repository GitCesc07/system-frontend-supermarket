import { isAxiosError } from "axios";
import api from "../lib/axios";
import { inventoryDataSchema } from "../types/inventory.interface";

// * Get all products by inventory
export async function getInventory() {
    try {
        const { data } = await api("/inventory/");
        const response = inventoryDataSchema.safeParse(data)
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}