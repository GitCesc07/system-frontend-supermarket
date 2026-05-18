import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
  userSchema,
  type UserLoginForm,
  type NewPasswordForm,
  type ConfirmToken,
  type ForgotPasswordForm,
  type ConfirmTokenNew,
  type RequestConfirmationCodeForm,
} from "@/types/auth.interface";
import type { Error } from "@/types/errors.interface";

export async function confirmAccount(formData: ConfirmTokenNew) {
  try {
    const url = "/auth/confirm-account";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error: Error | unknown) {
    if (isAxiosError(error) && error.response) {
      throw error.response?.data;
    }
  }
}

export async function requestConfirmationCode(
  formData: RequestConfirmationCodeForm
) {
  try {
    const url = "/auth/request-code";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response?.data;
    }
  }
}

export async function authenticateUser(formData: UserLoginForm) {
  try {
    const url = "/auth/login";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response?.data;
    }
  }
}

export async function logout() {
  try {
    const url = "/auth/logout";
    const { data } = await api.post<string>(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response?.data;
    }
  }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
  try {
    const url = "/auth/forgot-password";
    const { data } = await api.post<Error | undefined>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response?.data;
    }
  }
}

export async function validateToken(formData: ConfirmToken) {
  try {
    const url = "/auth/validate-token";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response?.data;
    }
  }
}

export async function updatePasswordWithToken({
  formData,
  token,
}: {
  formData: NewPasswordForm;
  token: ConfirmToken["access_token"];
}) {
  try {
    const url = `/auth/update-password/${token}`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response?.data;
    }
  }
}

export async function getUser() {
  try {
    const { data } = await api("/auth/user");
    const response = userSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response?.data;
    }
  }
}