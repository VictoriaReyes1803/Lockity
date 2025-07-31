import type { act } from "react";
import type { logsresponse , LogResponse} from "../models/logs"; // ajusta el path según donde lo tengas

import {getApi} from "./interceptor";
const api = getApi("nest");
const pre = 'api/';
const isElectron = (): boolean => {
  return typeof navigator === "object" && navigator.userAgent.toLowerCase().includes("electron");
};

export const accesslogs = async (
  lockerSerialNumber: string,
  page: number,
  limit: number,
  compartment?: number,
  performerEmail?: string,
  action?: string,
  dateFrom?: string,
  dateTo?: string
): Promise<logsresponse> => {
  const params: any = {
    page,
    limit,
  };
  if (compartment) {
    params.compartment = compartment;
  }
  if (performerEmail) {
    params.performerEmail = performerEmail;
  }
  if (action) {
    params.action = action;
  }
  if (dateFrom) {
    params.dateFrom = dateFrom;
  }
  if (dateTo) {
    params.dateTo = dateTo;
  }

  const response = await api.get(`${pre}access-logs/${lockerSerialNumber}/`, { params });
  console.log('params',params)
  console.log("Access logs response:", response.data);
  return response.data;
};

export const auditLogs = async (
    page: number,
    limit: number,
    lockerSerialNumber: string,
    performerEmail?: string,
    dateFrom?: string,
    dateTo?: string
): Promise<LogResponse> => {
    const params: any = {
        page,
        limit,
    };
    if (performerEmail) {
        params.performerEmail = performerEmail;
    }
    if (dateFrom) {
        params.dateFrom = dateFrom;
    }
    if (dateTo) {
        params.dateTo = dateTo;
    }
    
    const response = await api.get(`${pre}audit-logs/${lockerSerialNumber}/`, { params });
    console.log("Audit logs response:", response.data);
    return response.data;
    }

    export const notificationsregister = async (
      device_token: string,
    
    ): Promise<void> => {
      const payload = {
        device_token,
        device_type: isElectron() ? "desktop" : "web",
      };
      const response = await api.post(`${pre}notifications/register`, payload);
      console.log("Notifications register response:", response.data);
      return response.data;
    }

    export const notificationsunregister = async (
      device_token: string,
    ): Promise<void> => {
      const payload = {
        device_token,
      };
      const response = await api.delete(`${pre}notifications/unregister`, { data: payload });
      console.log("Notifications unregister response:", response.data);
      return response.data;
    }