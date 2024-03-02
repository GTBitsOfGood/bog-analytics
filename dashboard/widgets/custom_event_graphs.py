import streamlit as st
import pandas as pd
import altair as alt


def init_plot_custom_graphs(custom_events, custom_graphs):
    charts = []
    for graph in custom_graphs:
        matching_events = [
            event
            for event in custom_events
            if event.category == graph.category
            and event.subcategory == graph.subcategory
        ]

        data = {
            "x": [event.event_properties[graph.xProperty] for event in matching_events],
            "y": [event.event_properties[graph.yProperty] for event in matching_events],
        }
        df = pd.DataFrame(data)

        base = (
            alt.Chart(df)
            .encode(
                x=alt.X("x:Q", axis=alt.Axis(title=graph.xProperty)),
                y=alt.Y("y:Q", axis=alt.Axis(title=graph.yProperty)),
            )
            .properties(
                title=f"Event Category: {graph.category} - Subcategory: {graph.subcategory}"
            )
        )

        if graph.graphType == "bar":
            chart = base.mark_bar().encode(
                x=alt.X("x:N", axis=alt.Axis(title=graph.xProperty))
            )
        elif graph.graphType == "line":
            chart = base.mark_line()
        elif graph.graphType == "scatter":
            chart = base.mark_circle()

        charts.append(chart)

    return charts
