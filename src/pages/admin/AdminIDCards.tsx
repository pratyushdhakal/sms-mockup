import { useState } from "react";
import { Plus, X, Search, Trash2, Printer, Check } from "lucide-react";
import { STUDENTS, CLASS_GROUPS, BATCHES } from "../../data";
import { useNavigate } from "../../NavContext";
import Header from "../../layouts/Header";
import type { Student } from "../../types";

const MODAL_TABS = ["Bulk (by Batch)", "Individual"] as const;
type ModalTab = (typeof MODAL_TABS)[number];

const ACCENT_COLORS = [
  { label: "indigo", value: "bg-indigo-600", border: "border-indigo-600", ring: "ring-indigo-600", hex: "#4f46e5" },
  { label: "blue", value: "bg-blue-800", border: "border-blue-800", ring: "ring-blue-800", hex: "#1e40af" },
  { label: "green", value: "bg-green-600", border: "border-green-600", ring: "ring-green-600", hex: "#16a34a" },
  { label: "red", value: "bg-red-600", border: "border-red-600", ring: "ring-red-600", hex: "#dc2626" },
  { label: "purple", value: "bg-purple-600", border: "border-purple-600", ring: "ring-purple-600", hex: "#9333ea" },
  { label: "orange", value: "bg-orange-600", border: "border-orange-600", ring: "ring-orange-600", hex: "#ea580c" },
];

const getClass = (id: string) => CLASS_GROUPS.find((c) => c.id === id);
const getClassName = (id: string) => getClass(id)?.name ?? id;
const getClassSection = (id: string) => {
  const c = getClass(id);
  return c ? `${c.name} (${c.section})` : id;
};
const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function AdminIDCards() {
  const { navigate, setViewEntity } = useNavigate();
  const [viewState, setViewState] = useState<"idle" | "design">("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  const [modalTab, setModalTab] = useState<ModalTab>("Bulk (by Batch)");
  const [bulkClass, setBulkClass] = useState("");
  const [bulkBatch, setBulkBatch] = useState("");
  const [individualSearch, setIndividualSearch] = useState("");
  const [selectedInModal, setSelectedInModal] = useState<string[]>([]);

  const [accentIndex, setAccentIndex] = useState(0);
  const [cardExpiry, setCardExpiry] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [primaryText, setPrimaryText] = useState("");
  const [subText, setSubText] = useState("");

  const accent = ACCENT_COLORS[accentIndex];

  const bulkFiltered = STUDENTS.filter((s) => {
    if (bulkClass && s.classId !== bulkClass) return false;
    if (bulkBatch && s.batch !== bulkBatch) return false;
    return true;
  });

  const individualFiltered = STUDENTS.filter((s) => {
    if (!individualSearch) return true;
    const q = individualSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      getClassName(s.classId).toLowerCase().includes(q) ||
      s.batch.toLowerCase().includes(q)
    );
  });

  const filteredStudents = modalTab === "Bulk (by Batch)" ? bulkFiltered : individualFiltered;

  const availableBatches = bulkClass
    ? [...new Set(STUDENTS.filter((s) => s.classId === bulkClass).map((s) => s.batch))].sort()
    : [...BATCHES].sort();

  const handleOpenModal = () => {
    setSelectedInModal(selectedStudents.map((s) => s.id));
    setBulkClass("");
    setBulkBatch("");
    setIndividualSearch("");
    setModalTab("Bulk (by Batch)");
    setIsModalOpen(true);
  };

  const handleConfirmAdd = () => {
    const toAdd = STUDENTS.filter((s) => selectedInModal.includes(s.id));
    setSelectedStudents(toAdd);
    if (toAdd.length > 0) setViewState("design");
    setIsModalOpen(false);
  };

  const toggleStudent = (id: string) => {
    setSelectedInModal((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    const allIds = filteredStudents.map((s) => s.id);
    const allSelected = allIds.every((id) => selectedInModal.includes(id));
    if (allSelected) {
      setSelectedInModal((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedInModal((prev) => {
        const set = new Set(prev);
        allIds.forEach((id) => set.add(id));
        return [...set];
      });
    }
  };

  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedInModal.includes(s.id));

  const previewStudent = selectedStudents[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="ID Cards" subtitle="Generate student ID cards" />

      {viewState === "idle" && (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-900">Select Students</h2>
            <p className="text-slate-500 text-sm mt-1">
              Choose students to generate ID cards. You can select individual students or bulk select by batch.
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
          >
            <Plus size={18} /> Add Students
          </button>
        </div>
      )}

      {viewState === "design" && (
        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-6">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
              <Printer size={16} /> Print ID Cards
            </button>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Accent Color</h3>
              <div className="flex gap-2.5">
                {ACCENT_COLORS.map((c, i) => (
                  <button
                    key={c.label}
                    onClick={() => setAccentIndex(i)}
                    className={`w-7 h-7 rounded-full ${c.value} ${
                      accentIndex === i ? "ring-2 ring-offset-2 ring-slate-400" : ""
                    } transition cursor-pointer`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">ID Card Details</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Expiry"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                />
                <input
                  type="text"
                  placeholder="Academic Session"
                  value={academicSession}
                  onChange={(e) => setAcademicSession(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                />
                <input
                  type="text"
                  placeholder="Primary Text"
                  value={primaryText}
                  onChange={(e) => setPrimaryText(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                />
                <input
                  type="text"
                  placeholder="Sub Text"
                  value={subText}
                  onChange={(e) => setSubText(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Students ({selectedStudents.length})
                </h3>
                <button
                  onClick={handleOpenModal}
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition flex items-center gap-1"
                >
                  <Plus size={14} /> Add Student
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedStudents.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 flex-shrink-0">
                        {initials(s.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => { setViewEntity({ type: "student", id: s.id }); navigate("student-detail"); }}>{s.name}</p>
                        <p className="text-xs text-slate-400">
                          {s.rollNumber} &middot; {getClassSection(s.classId)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStudents((prev) => prev.filter((st) => st.id !== s.id))}
                      className="text-slate-300 hover:text-red-500 transition p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                {selectedStudents.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No students selected</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Preview ({selectedStudents.length})
            </h3>
            {previewStudent && (
              <div className="flex justify-center">
                <div
                  className={`w-96 rounded-xl border-t-4 ${accent.border} bg-white shadow-sm overflow-hidden`}
                >
                  <div className="p-5 flex items-start gap-5">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0 ${accent.value}`}
                    >
                      {initials(previewStudent.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-slate-900 truncate">{previewStudent.name}</p>
                      <p className="text-sm text-slate-500">{getClassSection(previewStudent.classId)}</p>
                      <div className="mt-2 space-y-0.5">
                        <p className="text-xs text-slate-400">
                          Roll: <span className="font-medium text-slate-600">{previewStudent.rollNumber}</span>
                        </p>
                        <p className="text-xs text-slate-400">
                          Batch: <span className="font-medium text-slate-600">{previewStudent.batch}</span>
                        </p>
                        {academicSession && (
                          <p className="text-xs text-slate-400">
                            Session: <span className="font-medium text-slate-600">{academicSession}</span>
                          </p>
                        )}
                        {cardExpiry && (
                          <p className="text-xs text-slate-400">
                            Expires: <span className="font-medium text-slate-600">{cardExpiry}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`px-5 py-2.5 ${accent.value} bg-opacity-10`}>
                    <p className="text-sm font-semibold text-slate-800">
                      {primaryText || "Vidya School"}
                    </p>
                    <p className="text-xs text-slate-500">{subText || "Education for All"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[520px] max-h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Add Students</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex border-b border-slate-100 px-6">
              {MODAL_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab)}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    modalTab === tab
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="px-6 py-4 border-b border-slate-100">
              {modalTab === "Bulk (by Batch)" ? (
                <div className="flex gap-3">
                  <select
                    value={bulkClass}
                    onChange={(e) => {
                      setBulkClass(e.target.value);
                      setBulkBatch("");
                    }}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                  >
                    <option value="">Select Class</option>
                    {CLASS_GROUPS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.section})
                      </option>
                    ))}
                  </select>
                  <select
                    value={bulkBatch}
                    onChange={(e) => setBulkBatch(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                  >
                    <option value="">Select Batch</option>
                    {availableBatches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by name, roll, class, or batch..."
                    value={individualSearch}
                    onChange={(e) => setIndividualSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-3 min-h-0">
              {!bulkClass && modalTab === "Bulk (by Batch)" ? (
                <p className="text-sm text-slate-400 text-center py-8">Select a class and batch to see students</p>
              ) : filteredStudents.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No students found</p>
              ) : (
                <>
                  <label className="flex items-center gap-2 px-1 py-2 border-b border-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleAll}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-600">Select All ({filteredStudents.length})</span>
                  </label>
                  <div className="divide-y divide-slate-50">
                    {filteredStudents.map((s) => {
                      const isSelected = selectedInModal.includes(s.id);
                      return (
                        <label
                          key={s.id}
                          className={`flex items-center gap-3 px-1 py-2.5 cursor-pointer rounded transition ${
                            isSelected ? "bg-indigo-50/50" : "hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleStudent(s.id)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 flex-shrink-0">
                            {initials(s.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{s.name}</p>
                            <p className="text-xs text-slate-400">
                              {s.rollNumber} &middot; {getClassSection(s.classId)} &middot; Batch {s.batch}
                            </p>
                          </div>
                          {isSelected && (
                            <Check size={16} className="text-indigo-600 flex-shrink-0" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                {selectedInModal.length > 0
                  ? `${selectedInModal.length} student${selectedInModal.length > 1 ? "s" : ""} selected`
                  : "No students selected"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAdd}
                  disabled={selectedInModal.length === 0}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add {selectedInModal.length > 0 ? `(${selectedInModal.length})` : ""} Student{selectedInModal.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
