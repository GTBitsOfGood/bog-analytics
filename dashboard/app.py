from datetime import datetime
import streamlit as st
import pandas as pd
import numpy as np
from data import visit_events, click_events, input_events

st.title("Hello World!")
EVENT_TYPES = ["Visit Events", "Click Events", "Input Events"]
selected_event_type = st.sidebar.selectbox("Select Event Type", EVENT_TYPES)

if selected_event_type == EVENT_TYPES[0]:
    visit_sorted = sorted(visit_events, key=lambda event: event.event_properties.date)
    data = [
        {
            "Page URL": event.event_properties.pageUrl,
            "User ID": event.event_properties.user_id,
            "Date": event.event_properties.date,
        }
        for event in visit_sorted
    ]

    df = pd.DataFrame(data)
    df["Date"] = pd.to_datetime(df["Date"])
    df["Date"] = df["Date"].dt.strftime("%B %d, %Y %I:%M %p")

    df = df.sort_values(by="Date", ascending=False)
    df = df.head(5)
    st.table(df)


with st.sidebar:
    # days-toggle slider
    days_aggregation = st.slider(
        label="Select Data Timeframe",
        min_value=1,
        max_value=30,
        value=15,  # Default value of the slider
    )

print(selected_event_type)