import streamlit as st
import pandas as pd
import numpy as np
from data import visit_events, click_events, input_events

st.title("Hello World!")
EVENT_TYPES = ["Visit Events", "Click Events", "Input Events"]
selected_event_type = st.sidebar.selectbox("Select Event Type", EVENT_TYPES)

with st.sidebar:
    # days-toggle slider
    days_aggregation = st.slider(
        label="Select Data Timeframe",
        min_value=1,
        max_value=30,
        value=15,  # Default value of the slider
    )

print(selected_event_type)
