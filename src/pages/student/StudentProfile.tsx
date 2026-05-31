import { User, Mail, Phone, MapPin, Calendar, Users, Droplets, Globe, BookOpen } from "lucide-react";
import { useAuth } from "../../AuthContext";
import { useStore } from "../../StoreContext";
import { CLASS_GROUPS } from "../../data";
import Header from "../../layouts/Header";

export default function StudentProfile() {
  const { currentStudent } = useAuth();
  const { users } = useStore();
  const student = currentStudent;
  const user = users.find((u) => u.id === student?.userId);
  const classGroup = CLASS_GROUPS.find((c) => c.id === student?.classId);

  if (!student) return null;

  const fields = [
    { label: "Full Name", value: student.name, icon: User },
    { label: "Email", value: student.email, icon: Mail },
    { label: "Phone", value: student.phone, icon: Phone },
    { label: "Roll Number", value: student.rollNumber, icon: BookOpen },
    { label: "Class", value: classGroup ? `${classGroup.name} — ${classGroup.section}` : "—", icon: Users },
    { label: "Batch", value: student.batch, icon: Calendar },
    { label: "Gender", value: student.gender || "—", icon: Users },
    { label: "Date of Birth", value: student.dob || "—", icon: Calendar },
    { label: "Blood Group", value: student.bloodGroup || "—", icon: Droplets },
    { label: "Nationality", value: student.nationality || "—", icon: Globe },
    { label: "Religion", value: student.religion || "—", icon: Globe },
    { label: "Mother Tongue", value: student.motherTongue || "—", icon: Globe },
    { label: "Ethnic Group", value: student.ethnicGroup || "—", icon: Users },
    { label: "Permanent Address", value: student.permanentAddress || "—", icon: MapPin },
    { label: "Temporary Address", value: student.temporaryAddress || "—", icon: MapPin },
    { label: "Father's Name", value: student.fatherName || "—", icon: User },
    { label: "Father's Occupation", value: student.fatherOccupation || "—", icon: User },
    { label: "Mother's Name", value: student.motherName || "—", icon: User },
    { label: "Mother's Occupation", value: student.motherOccupation || "—", icon: User },
    { label: "Guardian", value: student.guardianName || "—", icon: Users },
    { label: "Guardian Contact", value: student.guardianContact || "—", icon: Phone },
    { label: "Guardian Relation", value: student.guardianRelation || "—", icon: Users },
    { label: "Admission Date", value: student.admissionDate || "—", icon: Calendar },
    { label: "Previous School", value: student.previousSchool || "—", icon: BookOpen },
    { label: "Account Email", value: user?.email || "—", icon: Mail },
    { label: "Account Status", value: student.status, icon: User },
  ];

  return (
    <div>
      <Header title="My Profile" subtitle="Personal and academic details" userName={student.name} userRole="Student" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon size={16} className="text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 mb-0.5">{label}</p>
              <p className="text-sm font-medium text-slate-700 break-words">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
