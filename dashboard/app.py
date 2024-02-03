import streamlit as st
import pandas as pd
import numpy as np
from data import visit_events, click_events, input_events

st.title('Hello World!')
EVENT_TYPES = [
    'Visit Events', 'Click Events', 'Input Events'
]
selected_event_type = st.sidebar.selectbox("Select Event Type", EVENT_TYPES)

if (selected_event_type == 'Visit Events'):
    visit_sorted = sorted(visit_events, key=lambda event: event.event_properties.date)
    # Convert the sorted list to a DataFrame for display
    data = [{
        'Page URL': event.event_properties.pageUrl,
        'User ID': event.event_properties.user_id,
        'Date': event.event_properties.date
    } for event in visit_sorted]

    df = pd.DataFrame(data)

    df['Date'] = pd.to_datetime(df['Date'])

    #cap num of rows
    df = df.head(20)
    df = df.sort_values(by='Date', ascending=False)
    st.table(df)
