"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Doc = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: string;
};

export default function DocumentUploader({
  entityType,
  entityId,
  facultyId,
  documents,
  editable,
}: {
  entityType: "proposal" | "revision";
  entityId: string;
  facultyId: string;
  documents: Doc[];
  editable: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!allowed.includes(file.type)) {
      alert(
        "Hanya file PDF, Word (.doc/.docx), atau Excel (.xls/.xlsx) yang diperbolehkan.",
      );
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const path = `${facultyId}/${entityType}/${entityId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("budget-documents")
      .upload(path, file);
    if (uploadError) {
      alert("Gagal mengunggah: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("budget_documents").insert({
      entity_type: entityType,
      entity_id: entityId,
      file_name: file.name,
      file_path: path,
      file_size: `${(file.size / 1024).toFixed(0)} KB`,
    });
    if (dbError) alert("Gagal menyimpan data dokumen: " + dbError.message);

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    router.refresh();
  }

  async function handleDelete(doc: Doc) {
    if (!confirm("Hapus dokumen ini?")) return;
    const supabase = createClient();
    await supabase.storage.from("budget-documents").remove([doc.file_path]);
    await supabase.from("budget_documents").delete().eq("id", doc.id);
    router.refresh();
  }

  async function handleDownload(doc: Doc) {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("budget-documents")
      .createSignedUrl(doc.file_path, 60);
    if (error || !data) {
      alert("Gagal membuka file.");
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  return (
    <div className="bg-white border border-[#E1DDCF] rounded-lg p-4 mb-4">
      <div className="font-semibold text-sm mb-2">Dokumen Pendukung</div>
      <div className="flex flex-col gap-2 mb-3">
        {documents.length === 0 && (
          <p className="text-xs text-[#5B5A55]">Belum ada dokumen diunggah.</p>
        )}
        {documents.map((d) => (
          <div
            key={d.id}
            className="flex justify-between items-center border border-[#E1DDCF] rounded-md px-3 py-2 text-xs"
          >
            <span>
              {d.file_name}{" "}
              <span className="text-[#5B5A55]">· {d.file_size}</span>
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => handleDownload(d)}
                className="text-[#1B2A4B] font-semibold hover:underline"
              >
                Lihat
              </button>
              {editable && (
                <button
                  onClick={() => handleDelete(d)}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {editable && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleUpload}
            className="hidden"
            id={`upload-${entityId}`}
          />
          <label
            htmlFor={`upload-${entityId}`}
            className="inline-block bg-[#EEF0F5] text-[#1B2A4B] text-xs font-semibold px-3 py-2 rounded-md cursor-pointer"
          >
            {uploading ? "Mengunggah..." : "+ Unggah Dokumen (PDF/Word/Excel)"}
          </label>
        </>
      )}
    </div>
  );
}
