import { useDrop } from "react-dnd"
import CanvasItem from "../CanvasItem/CanvasItem"
import { useCampaignStore } from "../../store/useCampaignStore"
import { v4 as uuidv4 } from "uuid"
import { useDrag } from "react-dnd"
import { useState } from "react"
import CloseIcon from "../../../public/icons/close"

export default function Column({ column, handelRemove, rowIndex, colIndex }) {
    const moveWidget = useCampaignStore((state) => state.moveWidgetInColumn)
    const addWidgetToColumn = useCampaignStore((state) => state.addWidgetToColumn)
    const removeRow = useCampaignStore((s) => s.removeRow)
    const previewMode = useCampaignStore((s) => s.previewMode)

    const [{ isDragging }, drag] = useDrag({
        type: "COLUMN",
        item: { fromRow: rowIndex, fromCol: colIndex, column, type: "COLUMN" },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const moveWidgetToAnotherColumn = useCampaignStore((state) => state.moveWidgetToAnotherColumn)

    const [, drop] = useDrop(() => ({
        accept: "WIDGET",
        drop: (item) => {
            const widget = {
                id: uuidv4(),
                type: item.type,
                data: { text: "پیش‌فرض", align: "left", width: "100%", } // ← مقدار اولیه
            }
            addWidgetToColumn(rowIndex, colIndex, widget)
        }
    }))
    const [showWidgetMenu, setShowWidgetMenu] = useState(false);

    const handleAddWidget = (type) => {
        const widget = {
            id: uuidv4(),
            type,
            data: { text: "پیش‌فرض", align: "left" }
        };
        addWidgetToColumn(rowIndex, colIndex, widget);
        setShowWidgetMenu(false);
    };
    const columnAlign = column.align || "center";

    const alignClass =
        columnAlign === "left"
            ? "items-start"
            : columnAlign === "right"
                ? "items-end"
                : "items-center";

    return (
        <div
            ref={drop}
            className={`flex flex-col ${alignClass} p-2 rounded ${!previewMode && "shadow"} transition-opacity ${isDragging ? "opacity-50" : ""}`}
            style={{ width: "100%" }}

        >
            {column.widgets.map((widget, index) => (
                <CanvasItem
                    key={widget.id}
                    widget={widget}
                    index={index}
                    rowIndex={rowIndex}
                    rowId={handelRemove}
                    colIndex={colIndex}
                    moveWidget={moveWidget}
                    moveWidgetToAnotherColumn={moveWidgetToAnotherColumn}
                />
            ))}
            {!previewMode && (
                <button
                    className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                    onClick={() => setShowWidgetMenu(!showWidgetMenu)}
                >
                    +
                </button>
            )}
            {showWidgetMenu && (
                <div className="absolute z-10 mt-1 bg-white border shadow rounded p-2 text-sm">
                    <button onClick={() => handleAddWidget("text")} className="block w-full text-left px-2 py-1 hover:bg-gray-100">📝 متن</button>
                    <button onClick={() => handleAddWidget("image")} className="block w-full text-left px-2 py-1 hover:bg-gray-100">🖼 تصویر</button>
                    <button onClick={() => handleAddWidget("hero")} className="block w-full text-left px-2 py-1 hover:bg-gray-100">🎯 Hero</button>
                    <button onClick={() => handleAddWidget("richblock")} className="block w-full text-left px-2 py-1 hover:bg-gray-100">📦 Rich Block</button>
                </div>
            )}
        </div>
    )
}

