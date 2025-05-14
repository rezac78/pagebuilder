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
    const responsiveMode = useCampaignStore((s) => s.siteSettings.responsiveMode)

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

    function getResponsiveColClass(width) {
        if (responsiveMode === "mobile") {
            return "col-span-12" // همه زیر هم
        } else if (responsiveMode === "tablet") {
            return width === 12
                ? "col-span-12"
                : width === 6
                    ? "col-span-12 md:col-span-6"
                    : `col-span-12 md:col-span-${width}`
        } else {
            // desktop
            return `col-span-${width}`
        }
    }

    return (
        <>
            <div className="w-full flex justify-start">
                <button
                    onClick={() => removeRow(row.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="حذف ردیف"
                >
                    <CloseIcon />
                </button>
            </div>

            <div
                ref={ref}
                className={`grid grid-cols-12 gap-4 my-4 transition-all ${isDragging ? "opacity-50" : ""}`}
            >
                {row.columns.map((col, colIndex) => (
                    <div
                        key={col.id}
                        className={`${getResponsiveColClass(col.width)}`}
                    >
                        <Column
                            column={col}
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}
