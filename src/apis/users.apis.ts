import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    type PermissionsUserFormData,
    permissionsUserFormDataSchema,
    userDataSchema,
    type UserFormDataAdd,
    type UserFormDataEdit,
    type UserFormDataEditStaff,
    type UserFormDataInfo,
    userFormDataSchema,
} from "@/types/users.interface";

// * Get all users
export async function getUsers() {
    try {
        const { data } = await api("/users")
        const response = userDataSchema.safeParse(data);

        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}

// * Get user by id
export async function getUserById({ id }: Pick<UserFormDataInfo, "id">) {
    try {
        const { data } = await api(`/users/${id}`);
        const response = userFormDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}

// * Create a new user
export async function createUser(formData: UserFormDataAdd) {
    try {
        const { data } = await api.post("/users/createUser", formData);
        return data
    } catch (error) {

        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}

type UserAPIType = {
    formData: UserFormDataEditStaff,
    userId: UserFormDataEdit["id"],
}

// * Updta data user by id
export async function updateUser({ formData, userId }: Pick<UserAPIType, "formData" | "userId">) {
    try {
        const { data } = await api.patch<string>(`/users/updateUser/${userId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}

type UserManagerAPIType = {
    formData: UserFormDataEdit,
    userId: UserFormDataEdit["id"],
}

// * Updta data user by manager
export async function updateByManagerUser({ userId, formData }: Pick<UserManagerAPIType, "formData" | "userId">) {
    try {
        const url = `/users/updateUserManager/${userId}`;
        const { data } = await api.patch<string>(url, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}

// * Delete user by id
export async function deleteUser(id: UserFormDataInfo["id"]) {
    try {
        const { data } = await api.delete<string>(`/users/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}


// * Permissions by Users
type PermissonsUserAPIType = {
    formData: PermissionsUserFormData,
    id_usuario: PermissionsUserFormData["id_usuario"],
}

// * Get permissions per user
export async function getPermissionsUser({ id_usuario }: Pick<PermissionsUserFormData, "id_usuario">) {
    try {
        const { data } = await api(`/users/permissionsUser/${id_usuario}`);
        const response = permissionsUserFormDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}

// * Create or Update permissions for user
export async function addOrUpdatePermissionsUser({ formData, id_usuario }: Pick<PermissonsUserAPIType, "formData" | "id_usuario">) {
    try {
        const { data } = await api.post<string>(`/users/createPermissions/${id_usuario}`, formData);        
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw error.response?.data;
        }
    }
}