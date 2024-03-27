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
        data_pairs = []
        graph_type = graph["graphType"]

        # For bar, we will get all the different x's and calculate their frequency
        if graph_type == "bar":
            freq = defaultdict(int)
            for event in custom_events:
                x = event["properties"][graph["xProperty"]]
                freq[x] += 1

            df_freq = pd.DataFrame(
                list(freq.items()), columns=[graph["xProperty"], "Frequency"]
            )

            chart = (
                alt.Chart(df_freq)
                .mark_bar(color="#FF8A54")
                .encode(
                    x=alt.X(
                        graph["xProperty"], axis=alt.Axis(title=graph["xProperty"])
                    ),
                    y=alt.Y("Frequency", axis=alt.Axis(title="Frequency")),
                )
                .properties(width=600, height=400)
            )

            st.altair_chart(chart, use_container_width=True)
        # For line, we will show how the value of x and its respective y change over time. y must be numeric
        elif graph_type == "line" or graph_type == "scatter":
            data = {
                graph["xProperty"]: [],
                graph["yProperty"]: [],
                "Time (Seconds)": [],
            }
            for event in custom_events:
                x = event["properties"][graph["xProperty"]]
                y = event["properties"][graph["yProperty"]]

                if not y.isnumeric():
                    continue
                data[graph["xProperty"]].append(x)
                data[graph["yProperty"]].append(float(y))
                data["Time (Seconds)"].append(event["createdAt"])
            if len(data[graph["xProperty"]]) > 0:
                df = pd.DataFrame(data)
                df["Time (Seconds)"] = pd.to_datetime(df["Time (Seconds)"]).dt.second
                filtered_data = df

                filtered_data = filtered_data.sort_values("Time (Seconds)")

                if graph_type == "line":
                    st.line_chart(
                        data=filtered_data,
                        x="Time (Seconds)",
                        y=graph["yProperty"],
                        color=graph["xProperty"],
                        use_container_width=True,
                    )
                elif graph_type == "scatter":
                    st.scatter_chart(
                        data=filtered_data,
                        x="Time (Seconds)",
                        y=graph["yProperty"],
                        color=graph["xProperty"],
                        use_container_width=True,
                    )
    return charts
