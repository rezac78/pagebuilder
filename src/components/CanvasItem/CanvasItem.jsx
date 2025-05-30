import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import Hero from "../widgets/Hero"
import TextBlock from "../widgets/TextBlock"
import ImageBlock from "../widgets/ImageBlock"
import { useCampaignStore } from "../../store/useCampaignStore"
import RichBlock from "../widgets/RichBlock"
import CloseIcon from "../../../public/icons/close"

export default function CanvasItem({ widget, index, rowIndex, colIndex, rowId, moveWidget, moveWidgetToAnotherColumn }) {
    const ref = useRef(null)
    const updateWidgetData = useCampaignStore((state) => state.updateWidgetData)
    const setSelectedWidget = useCampaignStore((s) => s.setSelectedWidget)
    const previewMode = useCampaignStore((s) => s.previewMode)
    const [, drop] = useDrop({
        accept: "CANVAS_WIDGET",
        hover(item, monitor) {
            if (!ref.current) return
            const dragIndex = item.index
            const hoverIndex = index
            const dragRow = item.rowIndex
            const dragCol = item.colIndex
            const hoverBoundingRect = ref.current.getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            if (dragRow === rowIndex && dragCol === colIndex) {
                if (dragIndex === hoverIndex) return
                if (hoverClientY < hoverMiddleY) {
                    moveWidget(rowIndex, colIndex, dragIndex, hoverIndex)
                    item.index = hoverIndex
                } else {
                    moveWidget(rowIndex, colIndex, dragIndex, hoverIndex + 1)
                    item.index = hoverIndex + 1
                }
                return
            }

            // بین ستون‌ها یا بین ردیف‌ها
            moveWidgetToAnotherColumn(dragRow, dragCol, dragIndex, rowIndex, colIndex, hoverIndex)
            item.rowIndex = rowIndex
            item.colIndex = colIndex
            item.index = hoverIndex
        }

    })
    const handleSelect = () => {
        setSelectedWidget({
            rowIndex,
            colIndex,
            rowId, // ✅ این خط را اضافه کن
            widgetId: widget.id,
            type: widget.type,
            data: widget.data
        })

    }
    const [{ isDragging }, drag] = useDrag({
        type: "CANVAS_WIDGET",
        item: { id: widget.id, index, rowIndex, colIndex },
        canDrag: !previewMode,
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    if (!previewMode) {
        drag(drop(ref))
    }


    const renderWidget = () => {
        switch (widget.type) {
            case "hero": return <Hero data={widget.data} />
            case "text": return <div onClick={handleSelect} className="cursor-pointer">
                <TextBlock data={widget.data} />
            </div>
            case "image": return <ImageBlock data={{ ...widget.data, rowIndex, colIndex, id: widget.id }} />

            case "richblock":
                return (
                    <RichBlock
                        data={widget.data}
                        onChange={(newElements) =>
                            updateWidgetData(rowIndex, colIndex, widget.id, { elements: newElements })
                        }
                    />
                )
            default: return null
        }
    }

    return (
        <>
            {/* {!previewMode && (
                <div className="flex justify-end gap-1 text-xs mt-2">
                    {["100%", "50%", "33%", "25%"].map((w) => (
                        <button
                            key={w}
                            onClick={() =>
                                updateWidgetData(rowIndex, colIndex, widget.id, { width: w })
                            }
                            className={`px-2 py-0.5 border rounded ${widget.data?.width === w ? "bg-blue-500 text-white" : "bg-white"
                                }`}
                        >
                            {w}
                        </button>
                    ))}
                </div>
            )} */}
            <div
                ref={ref}
                onClick={handleSelect}
                className={`${!previewMode ? "bg-white p-2 border rounded shadow" : ""} ${isDragging ? "opacity-50" : ""}`}
                style={{ width: widget.data?.width || "100%" }}
            >
                {/* {!previewMode && (
                    <div className="flex justify-between items-center mb-1">
                        <button
                            onClick={handleRemove}
                            className="text-red-500 hover:text-red-700 text-sm"
                            title="حذف ویجت"
                        >
                            <CloseIcon />
                        </button>
                        <span className="text-xs text-gray-400">{widget.type}</span>
                    </div>
                )} */}
                {renderWidget()}
            </div>
        </>
    )
}
