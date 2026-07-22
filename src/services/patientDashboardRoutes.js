import express from "express";

const router = express.Router();

const dashboardData = {
  statistics: {
    total_appointments: 5,
    upcoming_appointments: 2,
    active_reminders: 3,
    completed_appointments: 2,
  },

  upcoming_appointments: [
    {
      id: "APT-1001",
      doctor: {
        id: "doctor-1",
        name: "Dr. Sarah Ahmed",
        specialty: "Cardiologist",
      },
      appointment_date: "2026-07-24",
      appointment_time: "10:30 AM",
      consultation_type: "clinic",
      location: "HOKU Medical Center",
      reason: "Routine cardiac checkup",
      status: "confirmed",
      consultation_fee: 3500,
    },
    {
      id: "APT-1002",
      doctor: {
        id: "doctor-2",
        name: "Dr. Daniel Lee",
        specialty: "General Physician",
      },
      appointment_date: "2026-07-29",
      appointment_time: "02:00 PM",
      consultation_type: "video",
      location: "Online consultation",
      reason: "General health consultation",
      status: "pending",
      consultation_fee: 2500,
    },
  ],

  medication_reminders: [
    {
      id: "MED-1001",
      medicine_name: "Amlodipine",
      medication_type: "Tablet",
      dosage: "5 mg",
      frequency: "once_daily",
      frequency_label: "Once daily",
      reminder_times: ["08:00 AM"],
      instruction: "after_meal",
      instruction_label: "Take after breakfast",
      start_date: "2026-07-01",
      end_date: "2026-08-31",
      prescribed_by: "Dr. Sarah Ahmed",
      status: "active",
      is_active: true,
      next_dose: "Today at 08:00 AM",
    },
    {
      id: "MED-1002",
      medicine_name: "Vitamin D",
      medication_type: "Tablet",
      dosage: "1 tablet",
      frequency: "once_daily",
      frequency_label: "Once daily",
      reminder_times: ["01:00 PM"],
      instruction: "after_meal",
      instruction_label: "Take after lunch",
      start_date: "2026-07-05",
      end_date: "2026-09-05",
      prescribed_by: "Dr. Daniel Lee",
      status: "active",
      is_active: true,
      next_dose: "Today at 01:00 PM",
    },
    {
      id: "MED-1003",
      medicine_name: "Metformin",
      medication_type: "Tablet",
      dosage: "500 mg",
      frequency: "twice_daily",
      frequency_label: "Twice daily",
      reminder_times: [
        "08:00 AM",
        "08:30 PM",
      ],
      instruction: "after_meal",
      instruction_label: "Take after dinner",
      start_date: "2026-06-20",
      end_date: "2026-12-20",
      prescribed_by: "Dr. Daniel Lee",
      status: "overdue",
      is_active: true,
      next_dose: "Overdue by 45 minutes",
    },
  ],

  recent_activity: [
    {
      id: "ACT-1001",
      type: "appointment",
      title: "Appointment confirmed",
      description:
        "Your appointment with Dr. Sarah Ahmed was confirmed.",
      created_at: "2026-07-22T10:30:00.000Z",
    },
    {
      id: "ACT-1002",
      type: "reminder",
      title: "Medication reminder created",
      description:
        "A medication reminder was added for Vitamin D.",
      created_at: "2026-07-21T14:00:00.000Z",
    },
    {
      id: "ACT-1003",
      type: "profile",
      title: "Patient profile updated",
      description:
        "Your patient contact information was updated.",
      created_at: "2026-07-20T09:15:00.000Z",
    },
  ],

  health_profile: {
    blood_group: "B+",
    allergies: "No known allergies",
    medical_conditions:
      "No medical conditions provided",
    completion_percentage: 70,
  },
};

router.get("/dashboard", (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message:
        "Patient dashboard loaded successfully.",
      data: dashboardData,
    });
  } catch (error) {
    console.error(
      "Patient dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load patient dashboard.",
    });
  }
});

export default router;