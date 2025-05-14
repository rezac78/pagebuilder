import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from "uuid"

export const useCampaignStore = create(
    persist(
        (set) => ({
            widgets: [],
            siteSettings: {
                backgroundColor: "#ffffff",
                backgroundImage: "",
                responsiveMode: "desktop",
            },

            addRow: (columnsWidth = [12]) =>
                set((state) => {
                    const newRow = {
                        id: uuidv4(),
                        type: "row",
                        columns: columnsWidth.map((width) => ({
                            id: uuidv4(),
                            width,
                            widgets: [],
                        })),
                    };
                    return { widgets: [...state.widgets, newRow] };
                }),

            removeRow: (rowId) =>
                set((state) => ({
                    widgets: state.widgets.filter((row) => row.id !== rowId),
                })),

            moveRow: (dragIndex, hoverIndex) =>
                set((state) => {
                    const rows = [...state.widgets]
                    const [moved] = rows.splice(dragIndex, 1)
                    rows.splice(hoverIndex, 0, moved)
                    return { widgets: rows }
                }),

            addColumnToRow: (rowIndex, column) =>
                set((state) => {
                    const newState = [...state.widgets]
                    newState[rowIndex].columns.push(column)
                    return { widgets: newState }
                }),

            removeColumnFromRow: (rowIndex, colIndex) =>
                set((state) => {
                    const newState = [...state.widgets]
                    newState[rowIndex].columns.splice(colIndex, 1)
                    return { widgets: newState }
                }),

            removeWidgetFromColumn: (rowIndex, colIndex, widgetId) =>
                set((state) => {
                    const newWidgets = [...state.widgets]
                    newWidgets[rowIndex].columns[colIndex].widgets = newWidgets[rowIndex].columns[colIndex].widgets.filter(
                        (w) => w.id !== widgetId
                    )
                    return { widgets: newWidgets }
                }),

            addWidget: (widget) =>
                set((state) => ({
                    widgets: [...state.widgets, widget],
                })),

            removeWidget: (id) =>
                set((state) => ({
                    widgets: state.widgets.filter((w) => w.id !== id),
                })),

            moveWidget: (dragIndex, hoverIndex) => set((state) => {
                const updated = [...state.widgets];
                const [removed] = updated.splice(dragIndex, 1);
                updated.splice(hoverIndex, 0, removed);
                return { widgets: updated };
            }),

            addWidgetToColumn: (rowIndex, colIndex, widget) =>
                set((state) => {
                    const newWidgets = [...state.widgets]
                    newWidgets[rowIndex].columns[colIndex].widgets.push(widget)
                    return { widgets: newWidgets }
                }),

            moveWidgetInColumn: (rowIndex, colIndex, dragIndex, hoverIndex) =>
                set((state) => {
                    const column = state.widgets[rowIndex].columns[colIndex]
                    const items = [...column.widgets]
                    const [dragged] = items.splice(dragIndex, 1)
                    items.splice(hoverIndex, 0, dragged)
                    column.widgets = items
                    return { widgets: [...state.widgets] }
                }),

            updateWidgetData: (rowIndex, colIndex, widgetId, newData) =>
                set((state) => {
                    const column = state.widgets[rowIndex].columns[colIndex]
                    const widgetIndex = column.widgets.findIndex((w) => w.id === widgetId)
                    if (widgetIndex > -1) {
                        column.widgets[widgetIndex].data = {
                            ...column.widgets[widgetIndex].data,
                            ...newData,
                        }
                    }
                    return { widgets: [...state.widgets] }
                }),

            moveWidgetToAnotherColumn: (fromRow, fromCol, fromIndex, toRow, toCol, toIndex) =>
                set((state) => {
                    const widgets = [...state.widgets]
                    const widget = widgets[fromRow].columns[fromCol].widgets[fromIndex]
                    widgets[fromRow].columns[fromCol].widgets.splice(fromIndex, 1)
                    widgets[toRow].columns[toCol].widgets.splice(toIndex, 0, widget)
                    return { widgets }
                }),

            updateRowAlign: (rowIndex, align) =>
                set((state) => {
                    const newWidgets = [...state.widgets]
                    newWidgets[rowIndex].align = align
                    return { widgets: newWidgets }
                }),

            updateSiteSettings: (settings) =>
                set((state) => ({
                    siteSettings: {
                        ...state.siteSettings,
                        ...settings,
                    },
                })),

            updateColumnAlign: (rowIndex, colIndex, align) =>
                set((state) => {
                    const newWidgets = [...state.widgets];
                    newWidgets[rowIndex].columns[colIndex].align = align;
                    return { widgets: newWidgets };
                }),
        }),
        {
            name: 'campaign-store', // نام key داخل localStorage
            getStorage: () => localStorage, // یا مثلا sessionStorage
        }
    )
)
