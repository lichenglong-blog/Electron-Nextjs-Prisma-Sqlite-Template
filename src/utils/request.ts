import { message } from 'antd';

// HTTP状态码对应的错误信息
const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求数据',
  201: '新建或修改数据成功',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功',
  400: '请求有错误，服务器没有进行新建或修改数据的操作',
  401: '用户没有权限（令牌、用户名、密码错误）',
  403: '用户得到授权，但是访问是被禁止的',
  404: '请求的资源不存在',
  406: '请求的格式不可得',
  410: '请求的资源被永久删除',
  422: '当创建一个对象时，发生一个验证错误',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

// 类型定义
export interface ResponseType<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 通用请求函数，使用浏览器原生fetch API
 */
async function request<T = any>(
  url: string,
  options?: RequestInit
): Promise<ResponseType<T>> {
  const baseUrl = '/api';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    // 处理非2xx响应
    if (!response.ok) {
      const errorText = codeMessage[response.status] || response.statusText;
      message.error(`请求错误 ${response.status}: ${errorText}`);
      return { 
        success: false, 
        error: errorText 
      };
    }
    
    // 解析JSON响应
    const data = await response.json();
    return data;
  } catch (error: any) {
    message.error('网络异常，无法连接到服务器');
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// 扩展请求方法
const extendedRequest = {
  get: <T = any>(url: string, options?: RequestInit) => 
    request<T>(url, { method: 'GET', ...options }),
    
  post: <T = any>(url: string, data?: any, options?: RequestInit) => 
    request<T>(url, { 
      method: 'POST', 
      body: JSON.stringify(data), 
      ...options 
    }),
    
  put: <T = any>(url: string, data?: any, options?: RequestInit) => 
    request<T>(url, { 
      method: 'PUT', 
      body: JSON.stringify(data), 
      ...options 
    }),
    
  delete: <T = any>(url: string, options?: RequestInit) => 
    request<T>(url, { method: 'DELETE', ...options }),
};

export default extendedRequest; 