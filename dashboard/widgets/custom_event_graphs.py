import random
import streamlit as st
import pandas as pd
import altair as alt
from collections import defaultdict
import uuid

from utils import get_iso_string_n_days_ago


def init_plot_custom_graphs(custom_events, custom_graphs):
    charts = []
    for graph in custom_graphs:
        st.write(f"**{graph['graphTitle']}**")
        graph_type = graph["graphType"]

        # For bar, we will get all the different x's and y's and calculate their frequency
        if graph_type == "bar":
            freq = defaultdict(int)
            for event in custom_events:
                x = event["properties"][graph["xProperty"]]
                y = event["properties"][graph["yProperty"]]
                freq[f"x: {x}"] += 1
                freq[f"y: {y}"] += 1

            df_freq = pd.DataFrame(
                sorted(list(freq.items())),
                columns=[
                    f"{graph['xProperty']} (x) {graph['yProperty']} (y)",
                    "Frequency",
                ],
            )

            chart = (
                alt.Chart(df_freq)
                .mark_bar(color="#FF8A54")
                .encode(
                    x=alt.X(
                        f"{graph['xProperty']} (x) {graph['yProperty']} (y)",
                        axis=alt.Axis(
                            title=f"x: {graph['xProperty']} and y: {graph['yProperty']}"
                        ),
                    ),
                    y=alt.Y("Frequency", axis=alt.Axis(title="Frequency")),
                )
                .properties(width=600, height=400)
            )

            st.altair_chart(chart, use_container_width=True)
        # For line, we will show how the value of x and its respective y change over time. y must be numeric
        elif graph_type == "line" or graph_type == "scatter":
            graph_x, graph_y = graph["xProperty"], graph["yProperty"]
            if graph_x == graph_y:
                graph_x = f"(x) {graph_x}"
                graph_y = f"(y) {graph_y}"

            data = {
                graph_x: [],
                graph_y: [],
                "Time (Seconds)": [],
            }
            for event in custom_events:
                x = event["properties"][graph["xProperty"]]
                y = event["properties"][graph["yProperty"]]

                if not y.isnumeric():
                    continue
                data[graph_x].append(x)
                data[graph_y].append(float(y))
                data["Time (Seconds)"].append(event["createdAt"])
            if len(data[graph_x]) > 0:
                df = pd.DataFrame(data)
                df["Time (Seconds)"] = pd.to_datetime(df["Time (Seconds)"]).dt.second
                filtered_data = df

                filtered_data = filtered_data.sort_values("Time (Seconds)")

                if graph_type == "line":

                    if x.isnumeric() and y.isnumeric():
                        st.line_chart(
                            data=filtered_data,
                            x=graph_x,
                            y=graph_y,
                            color="#FF8A54",
                            use_container_width=True,
                        )

                    else:
                        st.line_chart(
                            data=filtered_data,
                            x="Time (Seconds)",
                            y=graph_y,
                            color=graph_x,
                            use_container_width=True,
                        )
                elif graph_type == "scatter":
                    if x.isnumeric() and y.isnumeric():
                        st.scatter_chart(
                            data=filtered_data,
                            x=graph_x,
                            y=graph_y,
                            color=graph_x,
                            use_container_width=True,
                        )

                    else:
                        st.scatter_chart(
                            data=filtered_data,
                            x="Time (Seconds)",
                            y=graph_y,
                            color=graph_x,
                            use_container_width=True,
                        )
    return charts
