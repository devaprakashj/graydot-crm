import { API_URL } from '../config';

// Since Apps Script requires redirect following and doesn't support CORS easily with axios directly sometimes,

// we'll use a fetch-based approach for GAS compatibility if needed, but modern axios handles redirects.
// Note: GAS doPost requires payload as string.

export const request = async (action: string, data: any = {}) => {
  if (API_URL.includes("YOUR_APPS_SCRIPT")) {
    alert("Please set your Apps Script URL in src/config.ts first!");
    return { success: false, message: "API URL not set" };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action, ...data }),
      mode: 'cors',
      redirect: 'follow', // Crucial for GAS
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // GAS weirdness
      },
    });
    const result = await response.json();
    if (result.message?.includes("Account disabled")) {
      localStorage.clear();
      window.location.href = "/"; // Force redirect
      return { success: false, message: result.message };
    }
    return result;
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, message: "Network or Server Error" };
  }
};

export const getRequest = async (action: string, params: any = {}) => {
  if (API_URL.includes("YOUR_APPS_SCRIPT")) {
    return { success: false, message: "API URL not set" };
  }

  const queryParams = new URLSearchParams({ action, ...params }).toString();
  try {
    const response = await fetch(`${API_URL}?${queryParams}`, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
    });
    const result = await response.json();
    if (result.message?.includes("Account disabled")) {
      localStorage.clear();
      window.location.href = "/"; // Force redirect
      return { success: false, message: result.message };
    }
    return result;
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, message: "Network or Server Error" };
  }
};
