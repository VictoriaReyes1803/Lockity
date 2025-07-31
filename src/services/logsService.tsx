import type { act } from "react";
import type { logsresponse , LogResponse} from "../models/logs"; // ajusta el path según donde lo tengas

import {getApi} from "./interceptor";
const api = getApi("nest");
const pre = 'api/';

export const accesslogs = async (
  lockerSerialNumber: string,
  page: number,
  limit: number,
  compartmentNumber?: number,
  performerEmail?: string,
  action?: string,
  dateFrom?: string,
  dateTo?: string
): Promise<logsresponse> => {
  const params: any = {
    page,
    limit,
  };
  if (compartmentNumber) {
    params.compartmentNumber = compartmentNumber;
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