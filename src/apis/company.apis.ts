import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    companyDataSchema,
    type CompanyFormData,
    type CompanyFormDataAdd,
    type CompanyFormDataEdit
} from "../types/company.interface";

// * Get all company data
export async function getCompanyData() {
    try {
        const { data } = await api("/company")
        const response = companyDataSchema.safeParse(data)
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Get  company data by id
export async function getCompanyById({ id }: Pick<CompanyFormData, "id">) {
    try {
        const { data } = await api(`/company/${id}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Create a new company
export async function createCompany(formData: CompanyFormDataAdd) {
    try {
        const { data } = await api.post("/company/createCompany", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

type CompanyAPIType = {
    formData: CompanyFormDataEdit,
    companyId: CompanyFormDataEdit["id"],
}

// * Update company by id
export async function updateCompany({ companyId, formData }: Pick<CompanyAPIType, "companyId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/company/updateCompany/${companyId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}
