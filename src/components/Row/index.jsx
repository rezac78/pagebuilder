import Column from '../Column/index'
import { useDrag, useDrop } from "react-dnd"
import { useRef } from "react"
import { useCampaignStore } from "../../store/useCampaignStore"
import CloseIcon from '../../../public/icons/close'

export default function Row({ row, rowIndex, moveRow }) {
    const ref = useRef(null)
    const addColumnToRow = useCampaignStore((state) => state.addColumnToRow)
    const removeColumnFromRow = useCampaignStore((state) => state.removeColumnFromRow)
    const removeRow = useCampaignStore((s) => s.removeRow)
    const responsiveMode = useCampaignStore((s) => s.siteSettings.responsiveMode);

    const [, drop] = useDrop({
        accept: ["ROW", "COLUMN"],
        drop: (item) => {
            if (item.type === "COLUMN") {
                if (item.fromRow === rowIndex) return
                addColumnToRow(rowIndex, item.column)
                removeColumnFromRow(item.fromRow, item.fromCol)
            }
        },
        hover: (item) => {
            if (item.type === "ROW") {
                if (item.index === rowIndex) return
                moveRow(item.index, rowIndex)
                item.index = rowIndex
            }
        }
    })

    const [{ isDragging }, drag] = useDrag({
        type: "ROW",
        item: { id: row.id, index: rowIndex, type: "ROW" },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    drag(drop(ref))
    let gridCols = "grid-cols-1";
    const rowAlign = row.align || "center";

    const colCount = row.columns.length
    if (responsiveMode === "desktop") {
        gridCols = colCount === 1
            ? "grid-cols-1"
            : colCount === 2
                ? "grid-cols-2"
                : "grid-cols-3";
    } else if (responsiveMode === "tablet") {
        gridCols = "grid-cols-1 md:grid-cols-2"; // یا فقط "grid-cols-2" در صورت نیاز
    } else if (responsiveMode === "mobile") {
        gridCols = "grid-cols-1"; // همه زیر هم
    }
    return (
        <>
            <div className="w-full flex justify-start">
                <button
                    onClick={() => removeRow(row.id)}
                    className="text-red-500 hover:text-red-700 text-sm "
                    title="حذف ردیف"
                >
                    <CloseIcon />
                </button>
            </div>
            <div className="flex gap-2 items-center justify-start text-xs mb-2">
                <span className="text-gray-500">🧭 موقعیت ردیف:</span>
                {["left", "center", "right"].map((align) => (
                    <button
                        key={align}
                        onClick={() => useCampaignStore.getState().updateRowAlign(rowIndex, align)}
                        className={`px-2 py-1 border rounded ${row.align === align ? "bg-blue-500 text-white" : "bg-white"
                            }`}
                    >
                        {align === "left" && "⬅ چپ"}
                        {align === "center" && "⬍ وسط"}
                        {align === "right" && "➡ راست"}
                    </button>
                ))}
            </div>
            <div
                ref={ref}
                className={`flex gap-4 my-3 transition-all ${isDragging ? "opacity-50" : ""}`}
                style={{
                    justifyContent:
                        rowAlign === "left"
                            ? "flex-start"
                            : rowAlign === "right"
                                ? "flex-end"
                                : "center",
                }}
            >

                {row.columns.map((col, colIndex) => (
                    <Column
                        key={col.id}
                        column={col}
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                    />
                ))}
            </div>
        </>
    )
}
