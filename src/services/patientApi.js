import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000/api";

const patientApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* =========================================================
   Helpers
========================================================= */

const getStoredPatientToken = () =>
  localStorage.getItem("patient-token");

const getStoredRefreshToken = () =>
  localStorage.getItem(
    "patient-refresh-token"
  );

const savePatientToken = (token) => {
  if (!token) return;

  localStorage.setItem(
    "patient-token",
    token
  );
};

export const clearPatientAuthentication =
  () => {
    localStorage.removeItem(
      "patient-token"
    );

    localStorage.removeItem(
      "patient-refresh-token"
    );

    localStorage.removeItem(
      "patient-user"
    );
  };

const unwrapResponse = (response) =>
  response?.data?.data ??
  response?.data ??
  response;

const getErrorMessage = (
  error,
  fallbackMessage
) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallbackMessage;

/* =========================================================
   Request interceptor
========================================================= */

patientApi.interceptors.request.use(
  (config) => {
    const token =
      getStoredPatientToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   Response interceptor and token refresh
========================================================= */

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeToTokenRefresh = (
  callback
) => {
  refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = (
  newToken
) => {
  refreshSubscribers.forEach(
    (callback) => callback(newToken)
  );

  refreshSubscribers = [];
};

patientApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config;

    const status =
      error?.response?.status;

    if (
      status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken =
      getStoredRefreshToken();

    /*
     * During temporary/mock authentication,
     * a refresh token may not exist.
     */
    if (!refreshToken) {
      clearPatientAuthentication();

      if (
        window.location.pathname !==
        "/patient/login"
      ) {
        window.location.href =
          "/patient/login";
      }

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise(
        (resolve, reject) => {
          subscribeToTokenRefresh(
            (newToken) => {
              if (!newToken) {
                reject(error);
                return;
              }

              originalRequest.headers.Authorization =
                `Bearer ${newToken}`;

              resolve(
                patientApi(
                  originalRequest
                )
              );
            }
          );
        }
      );
    }

    isRefreshing = true;

    try {
      const refreshResponse =
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {
            refresh_token:
              refreshToken,
          },
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const refreshData =
        unwrapResponse(
          refreshResponse
        );

      const newToken =
        refreshData?.accessToken ||
        refreshData?.access_token ||
        refreshData?.token;

      if (!newToken) {
        throw new Error(
          "A new patient token was not returned."
        );
      }

      savePatientToken(newToken);

      notifyRefreshSubscribers(
        newToken
      );

      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;

      return patientApi(
        originalRequest
      );
    } catch (refreshError) {
      notifyRefreshSubscribers(null);

      clearPatientAuthentication();

      if (
        window.location.pathname !==
        "/patient/login"
      ) {
        window.location.href =
          "/patient/login";
      }

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing = false;
    }
  }
);

/* =========================================================
   Patient authentication
========================================================= */

export const loginPatient = async (
  credentials
) => {
  try {
    const response =
      await patientApi.post(
        "/auth/patient/login",
        credentials
      );

    const data =
      unwrapResponse(response);

    const accessToken =
      data?.accessToken ||
      data?.access_token ||
      data?.token;

    const refreshToken =
      data?.refreshToken ||
      data?.refresh_token;

    const patient =
      data?.patient ||
      data?.user;

    if (accessToken) {
      localStorage.setItem(
        "patient-token",
        accessToken
      );
    }

    if (refreshToken) {
      localStorage.setItem(
        "patient-refresh-token",
        refreshToken
      );
    }

    if (patient) {
      localStorage.setItem(
        "patient-user",
        JSON.stringify(patient)
      );
    }

    return {
      accessToken,
      refreshToken,
      patient,
      raw: data,
    };
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Patient login failed."
      )
    );
  }
};

export const registerPatient = async (
  patientData
) => {
  try {
    const response =
      await patientApi.post(
        "/auth/patient/register",
        patientData
      );

    return unwrapResponse(response);
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Patient registration failed."
      )
    );
  }
};

export const logoutPatient = async () => {
  try {
    const refreshToken =
      getStoredRefreshToken();

    if (refreshToken) {
      await patientApi.post(
        "/auth/logout",
        {
          refresh_token:
            refreshToken,
        }
      );
    }
  } catch (error) {
    console.warn(
      "Patient logout request failed:",
      error
    );
  } finally {
    clearPatientAuthentication();
  }
};

/* =========================================================
   Patient dashboard
========================================================= */

export const getPatientDashboard =
  async () => {
    try {
      const response =
        await patientApi.get(
          "/patient/dashboard"
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load the patient dashboard."
        )
      );
    }
  };

/* =========================================================
   Appointments
========================================================= */

export const getPatientAppointments =
  async (params = {}) => {
    try {
      const response =
        await patientApi.get(
          "/patient/appointments",
          {
            params,
          }
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load appointments."
        )
      );
    }
  };

export const getPatientAppointmentById =
  async (appointmentId) => {
    try {
      const response =
        await patientApi.get(
          `/patient/appointments/${appointmentId}`
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load appointment details."
        )
      );
    }
  };

export const createPatientAppointment =
  async (appointmentData) => {
    try {
      const response =
        await patientApi.post(
          "/patient/appointments",
          appointmentData
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to book the appointment."
        )
      );
    }
  };

export const reschedulePatientAppointment =
  async (
    appointmentId,
    appointmentData
  ) => {
    try {
      const response =
        await patientApi.patch(
          `/patient/appointments/${appointmentId}/reschedule`,
          appointmentData
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to reschedule the appointment."
        )
      );
    }
  };

export const cancelPatientAppointment =
  async (appointmentId) => {
    try {
      const response =
        await patientApi.patch(
          `/patient/appointments/${appointmentId}/cancel`
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to cancel the appointment."
        )
      );
    }
  };

/* =========================================================
   Doctors and services for booking
========================================================= */

export const getPatientServices =
  async (params = {}) => {
    try {
      const response =
        await patientApi.get(
          "/services",
          {
            params,
          }
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load healthcare services."
        )
      );
    }
  };

export const getPatientDoctors =
  async (params = {}) => {
    try {
      const response =
        await patientApi.get(
          "/doctors",
          {
            params,
          }
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load doctors."
        )
      );
    }
  };

export const getDoctorAvailableSlots =
  async (
    doctorId,
    appointmentDate
  ) => {
    try {
      const response =
        await patientApi.get(
          `/doctors/${doctorId}/available-slots`,
          {
            params: {
              date: appointmentDate,
            },
          }
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load available time slots."
        )
      );
    }
  };

/* =========================================================
   Medication reminders
========================================================= */

export const getMedicationReminders =
  async (params = {}) => {
    try {
      const response =
        await patientApi.get(
          "/patient/medication-reminders",
          {
            params,
          }
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load medication reminders."
        )
      );
    }
  };

export const getMedicationReminderById =
  async (reminderId) => {
    try {
      const response =
        await patientApi.get(
          `/patient/medication-reminders/${reminderId}`
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load medication reminder details."
        )
      );
    }
  };

export const createMedicationReminder =
  async (reminderData) => {
    try {
      const response =
        await patientApi.post(
          "/patient/medication-reminders",
          reminderData
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to create the medication reminder."
        )
      );
    }
  };

export const updateMedicationReminder =
  async (
    reminderId,
    reminderData
  ) => {
    try {
      const response =
        await patientApi.patch(
          `/patient/medication-reminders/${reminderId}`,
          reminderData
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to update the medication reminder."
        )
      );
    }
  };

export const updateMedicationReminderStatus =
  async (
    reminderId,
    status
  ) => {
    try {
      const response =
        await patientApi.patch(
          `/patient/medication-reminders/${reminderId}/status`,
          {
            status,
          }
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to update the reminder status."
        )
      );
    }
  };

export const markMedicationAsTaken =
  async (reminderId) => {
    try {
      const response =
        await patientApi.patch(
          `/patient/medication-reminders/${reminderId}/taken`,
          {
            taken_at:
              new Date().toISOString(),
          }
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to mark the medication as taken."
        )
      );
    }
  };

export const deleteMedicationReminder =
  async (reminderId) => {
    try {
      const response =
        await patientApi.delete(
          `/patient/medication-reminders/${reminderId}`
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to delete the medication reminder."
        )
      );
    }
  };

/* =========================================================
   Patient profile
========================================================= */

export const getPatientProfile =
  async () => {
    try {
      const response =
        await patientApi.get(
          "/patient/profile"
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load the patient profile."
        )
      );
    }
  };

export const updatePatientProfile =
  async (profileData) => {
    try {
      const response =
        await patientApi.patch(
          "/patient/profile",
          profileData
        );

      const data =
        unwrapResponse(response);

      const patient =
        data?.patient ||
        data?.user ||
        data;

      if (patient) {
        localStorage.setItem(
          "patient-user",
          JSON.stringify(patient)
        );

        window.dispatchEvent(
          new CustomEvent(
            "patient-profile-updated",
            {
              detail: patient,
            }
          )
        );
      }

      return patient;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to update the patient profile."
        )
      );
    }
  };

/* =========================================================
   AI symptom checker
========================================================= */

export const checkPatientSymptoms =
  async (symptomData) => {
    try {
      const response =
        await patientApi.post(
          "/ai/symptom-checker",
          symptomData
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to review the symptoms."
        )
      );
    }
  };

/* =========================================================
   AI chatbot
========================================================= */

export const sendPatientChatMessage =
  async (chatData) => {
    try {
      const response =
        await patientApi.post(
          "/ai/chat",
          chatData
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to send the chat message."
        )
      );
    }
  };

export const clearPatientChatHistory =
  async () => {
    try {
      const response =
        await patientApi.delete(
          "/ai/chat/history"
        );

      return unwrapResponse(response);
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to clear the chat history."
        )
      );
    }
  };

export default patientApi;