import homeHealth from "@/assets/services/home-health.png";
import palliativeCare from "@/assets/services/palliative-care.png";
import hospiceCare from "@/assets/services/hospice-care.png";

export const ServicesData = [
  {
    id: 1,
    slug: "home-health-care",

    title: "Home Health Care",

    image: homeHealth,

    shortDescription:
      "Professional medical care delivered in the comfort of your home to support recovery, independence, and overall well-being.",

    fullDescription:
      "Our Home Health Care service provides compassionate, personalized medical support for patients recovering from illness, surgery, or living with chronic conditions. Our experienced healthcare professionals work closely with patients and families to deliver high-quality care while promoting comfort, dignity, and independence at home.",

    features: [
      "Skilled Nursing Care",
      "Medication Management",
      "Post-Surgical Care",
      "Chronic Disease Management",
      "Health Monitoring",
      "Personalized Care Plans",
      "Family Education & Support",
      "24/7 Professional Assistance",
    ],

    benefits: [
      "Receive quality healthcare at home",
      "Reduce unnecessary hospital visits",
      "Improve recovery with personalized treatment",
      "Increase comfort and independence",
    ],

    icon: "FaHome",

    status: "active",

    createdAt: null,

    updatedAt: null,
  },

  {
    id: 2,
    slug: "palliative-care",

    title: "Palliative Care",

    image: palliativeCare,

    shortDescription:
      "Specialized medical care focused on improving quality of life by managing pain, symptoms, and emotional well-being.",

    fullDescription:
      "Our Palliative Care service is designed to provide relief from pain, stress, and symptoms associated with serious illnesses. We work alongside patients, families, and healthcare providers to improve physical, emotional, and spiritual well-being throughout treatment.",

    features: [
      "Pain & Symptom Management",
      "Emotional Support",
      "Psychological Counseling",
      "Family Guidance",
      "Care Coordination",
      "Nutrition Support",
      "Comfort-Focused Care",
      "24/7 Assistance",
    ],

    benefits: [
      "Improve overall quality of life",
      "Reduce pain and discomfort",
      "Support patients and families",
      "Coordinate comprehensive care",
    ],

    icon: "FaHeart",

    status: "active",

    createdAt: null,

    updatedAt: null,
  },

  {
    id: 3,
    slug: "hospice-care",

    title: "Hospice Care",

    image: hospiceCare,

    shortDescription:
      "Compassionate end-of-life care that focuses on dignity, comfort, emotional support, and peace for patients and families.",

    fullDescription:
      "Our Hospice Care service provides comprehensive end-of-life support for patients facing life-limiting illnesses. We prioritize comfort, dignity, symptom relief, and emotional care while supporting families throughout every stage of the journey.",

    features: [
      "Comfort & Pain Management",
      "Emotional & Spiritual Support",
      "Family Counseling",
      "Bereavement Support",
      "24/7 Nursing Availability",
      "Personal Care Assistance",
      "Caregiver Education",
      "Individualized Care Plans",
    ],

    benefits: [
      "Maintain dignity and comfort",
      "Reduce physical discomfort",
      "Provide emotional support",
      "Support loved ones throughout care",
    ],

    icon: "FaHandsHoldingHeart",

    status: "active",

    createdAt: null,

    updatedAt: null,
  },
];

export default ServicesData;