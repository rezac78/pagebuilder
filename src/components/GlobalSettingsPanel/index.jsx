import { useCampaignStore } from "../../store/useCampaignStore"

function GlobalSettingsPanel() {
    const siteSettings = useCampaignStore((s) => s.siteSettings);
    const updateSiteSettings = useCampaignStore((s) => s.updateSiteSettings);

    return (
        <div className="space-y-2 p-2 bg-white border rounded shadow text-sm">
            <h3 className="font-bold text-xs mb-2">🎛 تنظیمات کلی سایت</h3>

            <div className="flex flex-col gap-1">
                <label>🎨 رنگ پس‌زمینه:</label>
                <input
                    type="color"
                    value={siteSettings.backgroundColor}
                    onChange={(e) => updateSiteSettings({ backgroundColor: e.target.value })}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label>🖼 تصویر بک‌گراند:</label>
                <input
                    type="text"
                    placeholder="آدرس عکس"
                    value={siteSettings.backgroundImage}
                    onChange={(e) => updateSiteSettings({ backgroundImage: e.target.value })}
                    className="border rounded px-2 py-1 text-xs"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label>🔍 حالت پیش‌نمایش:</label>
                <div className="flex gap-2">
                    {["mobile", "tablet", "desktop"].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => updateSiteSettings({ responsiveMode: mode })}
                            className={`px-2 py-1 rounded border text-xs ${siteSettings.responsiveMode === mode ? "bg-blue-600 text-white" : "bg-white"
                                }`}
                        >
                            {mode === "mobile" ? "📱" : mode === "tablet" ? "📱 تبلت" : "🖥 دسکتاپ"}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default GlobalSettingsPanel