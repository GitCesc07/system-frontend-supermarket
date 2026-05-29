import { isAxiosError } from "axios";
import api from "../lib/axios";

// * Create file copy
export async function getFileBackup() {
    try {
        const { data } = await api("/backupAndRestore/backup", {
            responseType: "blob"
        })
        return data
    } catch (error) {
        console.log(error);
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new brand
export async function createRestore(formData: FormData) {
    try {
        const { data } = await api.post("backupAndRestore/restore", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}