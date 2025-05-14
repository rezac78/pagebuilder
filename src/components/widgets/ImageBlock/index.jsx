import React, { useState } from "react";
import { useCampaignStore } from "../../../store/useCampaignStore";

export default function ImageBlock({ data }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...data });

  const updateWidgetData = useCampaignStore((s) => s.updateWidgetData);

  const handleSave = () => {
    updateWidgetData(data.rowIndex, data.colIndex, data.id, form);
    setOpen(false);
  };

  const alignment = form?.align || "left";
  const alignWrapper = alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left";

  const imgClass = `inline-block max-w-full rounded ${form?.className || ""}`.trim();

  return (
    <>
      <div className={`${alignWrapper} w-full`} onClick={() => setOpen(true)}>
        <img
          src={form?.src || "/default.jpg"}
          alt={form?.alt || "تصویر"}
          style={{
            width: form?.width || "auto",
            height: form?.height || "auto",
          }}
          className={imgClass}
        />
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
              onClick={() => setOpen(false)}
            >
              ×
            </button>

            <h2 className="text-lg font-bold mb-2">تنظیمات تصویر</h2>

            <div className="space-y-2">
              <label className="block text-sm">📸 آدرس عکس (src):</label>
              <input
                className="w-full border rounded p-1 text-sm"
                value={form.src || ""}
                onChange={(e) => setForm({ ...form, src: e.target.value })}
              />

              <label className="block text-sm">🏷 متن alt:</label>
              <input
                className="w-full border rounded p-1 text-sm"
                value={form.alt || ""}
                onChange={(e) => setForm({ ...form, alt: e.target.value })}
              />

              <label className="block text-sm">↔️ عرض (px یا %):</label>
              <input
                className="w-full border rounded p-1 text-sm"
                value={form.width || ""}
                onChange={(e) => setForm({ ...form, width: e.target.value })}
              />

              <label className="block text-sm">↕️ ارتفاع (px یا auto):</label>
              <input
                className="w-full border rounded p-1 text-sm"
                value={form.height || ""}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
              />

              <label className="block text-sm">🎨 کلاس‌های سفارشی (Tailwind):</label>
              <input
                className="w-full border rounded p-1 text-sm"
                value={form.className || ""}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
              />

              <label className="block text-sm">🧭 ترازبندی:</label>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button className="px-4 py-1 rounded bg-gray-200 text-sm" onClick={() => setOpen(false)}>
                انصراف
              </button>
              <button className="px-4 py-1 rounded bg-blue-600 text-white text-sm" onClick={handleSave}>
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
