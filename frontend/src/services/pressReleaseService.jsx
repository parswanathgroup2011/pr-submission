// pressReleaseService.js
import apiClient from './apiClient';

const API_ENDPOINT = '/press-releases';

export const createPressRelease = async (prFormData) => {
  try {
    const response = await apiClient.post(`${API_ENDPOINT}/create`, prFormData,
    {headers:{ 'Content-Type': 'multipart/form-data' }});
    return response.data;
  } catch (error) {
    console.error(
      'Error in createPressRelease:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getPRStats = async () => {
  const { data } = await apiClient.get(`${API_ENDPOINT}/stats`);
  /* 
     BE →  { total, pending, approved, rejected }
     FE →  { totalPR, pendingPR, publishedPR, rejectPR }
  */
     return {
      totalPR:     data.totalPR     ?? data.total     ?? 0,
      pendingPR:   data.pendingPR   ?? data.pending   ?? 0,
      publishedPR: data.publishedPR ?? data.approved  ?? 0,
      // Dashboard prop is `rejectPR`, but BE sends `rejectedPR`
      rejectedPR:    data.rejectedPR  ?? data.rejected  ?? 0,
    };
};

/* ---------- pressReleaseService.js ---------- */
export const getPRHistory = async (queryParams = {}) => {
  const { data } = await apiClient.get(`${API_ENDPOINT}/history`, {
    params: queryParams,
  });

  //  use the key your controller actually sends  ↓↓↓
  return {
    pressRelease: data.pressRelease ?? [],   // ✅ CORRECT
    page:         data.page         ?? 1,
    totalPages:   data.totalPages   ?? 1,
  };
};



export const getPressReleaseById = async (prId) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINT}/${prId}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error in getPressReleaseById (${prId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};


export const updatePressRelease = async (prId, prUpdateData) => {
  try {
    const response = await apiClient.put(`${API_ENDPOINT}/${prId}`, prUpdateData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error(
      `❌ Error in updatePressRelease (${prId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};
 
export const deletePressRelease = async (prId) => {
  try {
    const response = await apiClient.delete(`${API_ENDPOINT}/${prId}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error in deletePressRelease (${prId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// ---------- pressReleaseService.js ----------
export const getAllPressReleases = async () => {
  try {
    const { data } = await apiClient.get(`${API_ENDPOINT}/`); // make sure BE endpoint exists
    return data; // array of all press releases
  } catch (error) {
    console.error('❌ Error in getAllPressReleases:', error.response?.data || error.message);
    throw error;
  }
};


// ✅ New function to download PR PDF
export const downloadPressReleasePDF = async (prId) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINT}/download/${prId}`, {
      responseType: 'blob', // important for file downloads
    });

    // Create a blob and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${prId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading PR PDF:', error);
    throw error;
  }
};

// ✅ ADMIN: Approve PR (wallet deducted in backend)
export const approvePressRelease = async (prId) => {
  try {
    const { data } = await apiClient.put(
      `${API_ENDPOINT}/approve/${prId}`
    );
    return data;
  } catch (error) {
    console.error(
      `❌ Error approving PR (${prId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// ❌ ADMIN: Reject PR (no wallet deduction)
export const rejectPressRelease = async (prId, payload = {}) => {
  try {
    const { data } = await apiClient.put(
      `${API_ENDPOINT}/reject/${prId}`,
      payload // { reason }
    );
    return data;
  } catch (error) {
    console.error(
      `❌ Error rejecting PR (${prId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};




export default {createPressRelease,getPRHistory,getPRStats,getPressReleaseById,updatePressRelease,deletePressRelease,getAllPressReleases,downloadPressReleasePDF,approvePressRelease,rejectPressRelease}