import { isAxiosError } from "axios";
import api from "../lib/axios";
import { queryDataSchema } from "../types/querysInitial.interface";

// * Get all information initial system
export async function getDataInitial() {
    try {
        const { data } = await api("/dataInitial")
        const response = queryDataSchema.safeParse(data);
        console.log(response);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}
