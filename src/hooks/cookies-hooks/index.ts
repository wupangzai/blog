import Cookies from 'js-cookie';

type CookieOptions = {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

export function useCookie<T = string>(key: string) {
  const get = (): T | undefined => {
    const value = Cookies.get(key);
    try {
      return value ? (JSON.parse(value) as T) : undefined;
    } catch {
      return value as T;
    }
  };

  const set = (value: T, options?: CookieOptions) => {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    Cookies.set(key, stringValue, options);
  };

  const remove = () => {
    Cookies.remove(key);
  };

  return {
    get,
    set,
    remove,
  };
}
