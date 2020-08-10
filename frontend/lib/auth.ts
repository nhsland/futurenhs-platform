import {
  LoginRequest,
  RecoveryRequest,
  SettingsRequest,
} from "@oryd/kratos-client";
import { adminApi } from "../utils/kratos";

export const getLoginFields = async (
  request: string
): Promise<LoginRequest> => {
  const res = await adminApi.getSelfServiceBrowserLoginRequest(request);
  return res.body;
};

export const getRecoveryFields = async (
  request: string
): Promise<RecoveryRequest> => {
  const res = await adminApi.getSelfServiceBrowserRecoveryRequest(request);
  return res.body;
};

export const getSettingsFields = async (
  request: string
): Promise<SettingsRequest> => {
  const res = await adminApi.getSelfServiceBrowserSettingsRequest(request);
  return res.body;
};
