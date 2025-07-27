import type { AxiosRequestConfig } from 'axios';

import qs from 'qs';

import { axiosInstance, options } from './axiosInstance';

/**
 * 以下方法中 泛型为约束传入参数的类型或者接受参数的类型
 * @param T 约束接口返回类型的泛型
 * @param R 约束接口传入参数类型的泛型, 一般可不传，由参数函数参数处决定也行
 */

async function get<T = any, R = any>(
  url: string,
  data?: R,
  config?: AxiosRequestConfig
): Promise<T> {
  const result = (await axiosInstance({
    method: 'GET',
    url,
    params: data || {},
    headers: Object.assign(config?.headers || {}, config),
  })) as T;
  return result;
}

async function post<T = any, R = any>(
  url: string,
  data?: R,
  config?: AxiosRequestConfig,
  type?: string
): Promise<T> {
  let contentType, body: any;
  const formData = new FormData();

  switch (type) {
    case 'form':
      contentType = 'application/x-www-form-urlencoded';
      body = qs.stringify(data); // TODO:FIXME stringify
      console.log('[ body ] >', body);
      break;
    case 'json':
      contentType = 'application/json';
      body = data;
      break;
    case 'multi':
      Object.entries(data || {}).forEach(([key, value]) => {
        formData.append(key, value as any);
      });
      body = formData;
      // ❗️注意：不需要手动设置 multipart 的 Content-Type，浏览器会自动带上正确的 boundary
      break;
  }

  const result = (await axiosInstance({
    method: 'POST',
    url,
    headers: Object.assign(config?.headers || {}, {
      'Content-Type': contentType,
    }),
    data: body,
  })) as T;
  return result;
}

async function postJson<T = any, R = any>(url: string, data?: R, config?: AxiosRequestConfig) {
  return await post<T, R>(url, data, config, 'json');
}

async function postForm<T = any, R = any>(url: string, data?: R, config?: AxiosRequestConfig) {
  return await post<T, R>(url, data, config, 'form');
}

async function postMulti<T = any, R = any>(url: string, data?: R, config?: AxiosRequestConfig) {
  return await post<T, R>(url, data, config, 'multi');
}

// 传入 object 修改 options 中的配置，用于拦截钩子
function setOptions(opts: any) {
  Object.entries(opts).forEach(([key, value]) => {
    options[key] = Object.assign(options[key], value);
  });
}

export const http = {
  get,

  postJson,
  postForm,
  postMulti,

  setOptions,
};
