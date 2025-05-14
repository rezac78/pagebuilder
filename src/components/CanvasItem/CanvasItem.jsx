import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import Hero from "../widgets/Hero"
import TextBlock from "../widgets/TextBlock"
import ImageBlock from "../widgets/ImageBlock"
import { useCampaignStore } from "../../store/useCampaignStore"
import RichBlock from "../widgets/RichBlock"
import CloseIcon from "../../../public/icons/close"

export default function CanvasItem({ widget, index, rowIndex, colIndex, moveWidget, moveWidgetToAnotherColumn }) {
    const ref = useRef(null)
    const updateWidgetData = useCampaignStore((state) => state.updateWidgetData)
    const removeWidgetFromColumn = useCampaignStore((s) => s.removeWidgetFromColumn)

    const handleRemove = () => {
        removeWidgetFromColumn(rowIndex, colIndex, widget.id)
    }
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

    const [{ isDragging }, drag] = useDrag({
        type: "CANVAS_WIDGET",
        item: { id: widget.id, index, rowIndex, colIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    drag(drop(ref))


    const renderWidget = () => {
        switch (widget.type) {
            case "hero": return <Hero data={widget.data} />
            case "text": return <TextBlock data={widget.data} />
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
        <div
            ref={ref}
            className={`bg-white p-2 border rounded shadow ${isDragging ? "opacity-50" : ""}`}
        >
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">{widget.type}</span>
                <div className="flex items-center gap-1 text-xs">
                    <button onClick={() => updateWidgetData(rowIndex, colIndex, widget.id, { align: "left" })}>⬅️</button>
                    <button onClick={() => updateWidgetData(rowIndex, colIndex, widget.id, { align: "center" })}>↔️</button>
                    <button onClick={() => updateWidgetData(rowIndex, colIndex, widget.id, { align: "right" })}>➡️</button>
                </div>
                <button
                    onClick={handleRemove}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="حذف ویجت"
                >
                    <CloseIcon />
                </button>
            </div>

            {renderWidget()}
        </div>
    )
}
