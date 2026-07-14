import doctorOne from "@/assets/specialist/doctor1.png";
import doctorTwo from "@/assets/specialist/doctor2.png";
import doctorThree from "@/assets/specialist/doctor3.png";
import doctorFour from "@/assets/specialist/doctor4.png";

const specialistsData = [
  {
    id: 1,
    slug: "dr-sarah-khan",
    name: "Dr. Sarah Khan",
    specialty: "Child Specialist",
    qualification: "MBBS, FCPS Pediatrics",
    experienceYears: 9,
    consultationFee: 2500,
    image: doctorOne,
    bio: "Experienced pediatric specialist providing compassionate healthcare for infants, children, and adolescents.",
    availability: "Monday - Saturday",
    isAvailable: true,
  },
  {
    id: 2,
    slug: "dr-amna-ali",
    name: "Dr. Amna Ali",
    specialty: "Gynecologist",
    qualification: "MBBS, FCPS Gynecology",
    experienceYears: 12,
    consultationFee: 3000,
    image: doctorTwo,
    bio: "Dedicated gynecologist specializing in women's health, pregnancy care, and reproductive wellness.",
    availability: "Monday - Friday",
    isAvailable: true,
  },
  {
    id: 3,
    slug: "dr-ahmed-raza",
    name: "Dr. Ahmed Raza",
    specialty: "Dental Specialist",
    qualification: "BDS, FCPS Dentistry",
    experienceYears: 8,
    consultationFee: 2000,
    image: doctorThree,
    bio: "Professional dental specialist offering preventive, restorative, and cosmetic dental care.",
    availability: "Tuesday - Sunday",
    isAvailable: true,
  },
  {
    id: 4,
    slug: "dr-hina-malik",
    name: "Dr. Hina Malik",
    specialty: "Dermatologist",
    qualification: "MBBS, FCPS Dermatology",
    experienceYears: 10,
    consultationFee: 2800,
    image: doctorFour,
    bio: "Qualified dermatologist providing care for skin, hair, nail, and allergy-related conditions.",
    availability: "Monday - Saturday",
    isAvailable: true,
  },
];

export default specialistsData;