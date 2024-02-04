from datetime import datetime
import streamlit as st
import pandas as pd
import numpy as np
from data import visit_events, click_events, input_events
from sidebar_widgets import init_days_slider, init_event_selectbox
from visit_event_widgets import init_recent_events_table
from utils import EventTypes


st.title("Analytics Dashboard")
selected_event_type = init_event_selectbox(st)
days_aggregation = init_days_slider(st)

if selected_event_type == EventTypes.VISIT_EVENTS.value:
    init_recent_events_table(st, visit_events)

if selected_event_type == EventTypes.CLICK_EVENTS.value:
    pass

if selected_event_type == EventTypes.INPUT_EVENTS.value:
    pass
