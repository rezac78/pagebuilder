import { useCampaignStore } from "../../store/useCampaignStore"
import Row from "../Row/index"

export default function Canvas({ isOpen }) {
    const rows = useCampaignStore((state) => state.widgets)
    const moveRow = useCampaignStore((state) => state.moveRow)
    const settings = useCampaignStore((s) => s.siteSettings);
    let widthClass = "w-full"
    if (settings.responsiveMode === "mobile") widthClass = "w-[375px]"
    if (settings.responsiveMode === "tablet") widthClass = "w-[768px]"
    return (
        <div
            style={{
                backgroundColor: settings.backgroundColor || "white",
                backgroundImage: settings.backgroundImage
                    ? `url(${settings.backgroundImage})`
                    : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className={`bg-white ${widthClass} min-h-screen transition-all p-4 shadow-xl mx-auto`}
        >
            {rows.map((row, rowIndex) => (
                <Row
                    key={row.id}
                    row={row}
                    rowIndex={rowIndex}
                    moveRow={moveRow}
                />
            ))}
        </div>
    )
}
