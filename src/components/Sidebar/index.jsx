import { useCampaignStore } from "../../store/useCampaignStore"
import MenuIcon from "../../../public/icons/menu"
import CloseIcon from "../../../public/icons/close"

export default function Sidebar({ isOpen, setIsOpen }) {
    const addRow = useCampaignStore((state) => state.addRow)

    const handleAddRow = (columns) => {
        addRow(columns)
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
                        <DraggableWidget type="hero" label="Hero" />
                        <DraggableWidget type="text" label="متن" />
                        <DraggableWidget type="image" label="تصویر" />
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
                </>
            )}
        </div>
    )
}
import { useDrag } from "react-dnd"
import GlobalSettingsPanel from "../GlobalSettingsPanel"

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