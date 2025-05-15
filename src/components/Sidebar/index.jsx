import { useCampaignStore } from "../../store/useCampaignStore"
import MenuIcon from "../../../public/icons/menu"
import CloseIcon from "../../../public/icons/close"
import GlobalSettingsPanel from "../GlobalSettingsPanel"

export default function Sidebar({ isOpen, setIsOpen }) {
    const addRow = useCampaignStore((state) => state.addRow)
    const selectedWidget = useCampaignStore((s) => s.selectedWidget)
    const updateWidgetData = useCampaignStore((s) => s.updateWidgetData)
    const setSelectedWidget = useCampaignStore((s) => s.setSelectedWidget)
    const previewMode = useCampaignStore((s) => s.previewMode)
    const togglePreviewMode = useCampaignStore((s) => s.togglePreviewMode)

    const handleAddRow = (columns) => {
        addRow(columns)
    }


    const handleUpdate = (field, value) => {
        if (!selectedWidget) return
        const { rowIndex, colIndex, widgetId, data, type } = selectedWidget

        const newData = {
            ...data,
            [field]: value
        }

        updateWidgetData(rowIndex, colIndex, widgetId, { [field]: value })
        setSelectedWidget({
            rowIndex,
            colIndex,
            widgetId,
            type,
            data: newData
        })
    }

    const layoutOptions = [
        { label: "ردیف تمام‌عرض", cols: [12] },
        { label: "ردیف دو ستونه", cols: [6, 6] },
        { label: "ردیف سه ستونه", cols: [4, 4, 4] },
    ]
    const widgetsList = {
        "پایه‌ای": [
            { type: "text", label: "متن" },
            { type: "image", label: "تصویر" },
        ],
        "پیشرفته": [
            { type: "hero", label: "Hero" },
            { type: "richblock", label: "Rich Block" },

        ],
    }

    return (
        <div
            className={`transition-all ${isOpen ? "w-[20%]" : "w-[60px]"
                } bg-gray-100 p-4 space-y-4 border-l min-h-screen`}
        >
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer mb-4">
                {isOpen ? <CloseIcon /> : <MenuIcon />}
            </div>

            {isOpen && (
                <>
                    <h2 className="font-bold text-lg">ساخت صفحه</h2>
                    <button
                        onClick={togglePreviewMode}
                        className="w-full bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                    >
                        {previewMode ? "بازگشت به ویرایش" : "نمایش خروجی نهایی"}
                    </button>
                    <GlobalSettingsPanel />
                    <section>
                        <h3 className="text-sm font-semibold mb-2">افزودن ردیف (Layout)</h3>
                        <div className="flex flex-col gap-2">
                            {layoutOptions.map((layout, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAddRow(layout.cols)}
                                    className="text-sm px-3 py-1 bg-white rounded border hover:bg-blue-50 transition"
                                >
                                    ➕ {layout.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    <hr className="my-4" />

                    <section>
                        <h3 className="text-sm font-semibold mb-2">درگ برای افزودن ویجت</h3>
                        {Object.entries(widgetsList).map(([category, items]) => (
                            <div key={category} className="mb-2">
                                <h4 className="text-xs text-gray-500">{category}</h4>
                                <div className="flex flex-col gap-1 mt-1">
                                    {items.map((widget) => (
                                        <DraggableWidget key={widget.type} type={widget.type} label={widget.label} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>

                    {selectedWidget?.type === "text" && (
                        <section className="space-y-2">
                            <h3 className="text-sm font-semibold">ویرایش متن</h3>
                            <input
                                type="text"
                                value={selectedWidget.data.text || ""}
                                onChange={(e) => handleUpdate("text", e.target.value)}
                                className="w-full border px-2 py-1 rounded"
                            />
                            <select
                                value={selectedWidget.data.tag}
                                onChange={(e) => handleUpdate("tag", e.target.value)}
                                className="w-full border px-2 py-1 rounded"
                            >
                                <option value="h1">عنوان بزرگ (h1)</option>
                                <option value="h2">عنوان (h2)</option>
                                <option value="p">پاراگراف (p)</option>
                            </select>
                            <select
                                value={selectedWidget.data.fontSize}
                                onChange={(e) => handleUpdate("fontSize", e.target.value)}
                                className="w-full border px-2 py-1 rounded"
                            >
                                <option value="text-sm">کوچک</option>
                                <option value="text-base">معمولی</option>
                                <option value="text-xl">بزرگ</option>
                                <option value="text-2xl">خیلی بزرگ</option>
                            </select>
                            <select
                                value={selectedWidget.data.fontWeight}
                                onChange={(e) => handleUpdate("fontWeight", e.target.value)}
                                className="w-full border px-2 py-1 rounded"
                            >
                                <option value="font-normal">معمولی</option>
                                <option value="font-bold">بولد</option>
                                <option value="font-light">لایت</option>
                            </select>
                            <input
                                type="color"
                                value={selectedWidget.data.color}
                                onChange={(e) => handleUpdate("color", e.target.value)}
                            />
                            <select
                                value={selectedWidget.data.align || "left"}
                                onChange={(e) => handleUpdate("align", e.target.value)}
                                className="w-full border px-2 py-1 rounded"
                            >
                                <option value="left">چپ</option>
                                <option value="center">وسط</option>
                                <option value="right">راست</option>
                                <option value="justify">هم‌تراز (justify)</option>
                            </select>
                        </section>
                    )}
                </>
            )}
        </div>
    )
}
import { useDrag } from "react-dnd"

const DraggableWidget = ({ type, label }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "WIDGET",
        item: { type },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }))

    return (
        <div
            ref={drag}
            className={`text-sm cursor-move px-3 py-1 bg-white rounded border ${isDragging ? "opacity-50" : ""
                }`}
        >
            🧩 {label}
        </div>
    )
}