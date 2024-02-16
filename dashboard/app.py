from collections import defaultdict
from datetime import datetime
import streamlit as st
from data import visit_events, click_events, get_aggregated_visit_data
from widgets.sidebar_widgets import init_days_slider, init_event_selectbox
from widgets.visit_event_widgets import init_recent_events_table, init_page_visit_graph
from widgets.click_event_widgets import init_object_click_bar_graph
from utils import EventTypes
import pandas as pd
from datetime import datetime, timedelta

st.title("Analytics Dashboard")
selected_event_type = init_event_selectbox(st)
days_aggregation = init_days_slider(st)

if selected_event_type == EventTypes.VISIT_EVENTS.value:
    init_recent_events_table(st, visit_events)
    init_page_visit_graph(st, visit_events)

if selected_event_type == EventTypes.CLICK_EVENTS.value:
    init_object_click_bar_graph(st, click_events)

if selected_event_type == EventTypes.INPUT_EVENTS.value:
    pass

# Aggregate the visit data
aggregated_data = get_aggregated_visit_data(visit_events)

# Create a dropdown for page selection
pages = aggregated_data['pageUrl'].unique()
selected_page = st.selectbox('Select a page to analyze:', ['All'] + list(pages))

# Filter data based on the selected page
if selected_page != 'All':
    filtered_data = aggregated_data[aggregated_data['pageUrl'] == selected_page]
else:
    filtered_data = aggregated_data

# Ensure the data is sorted by date for consistent plotting
filtered_data = filtered_data.sort_values('date')    

# Plotting
st.line_chart(data=filtered_data,
              x='date',
              y='number of visitors',
              color='pageUrl' if selected_page == 'All' else None,
              use_container_width=True)
