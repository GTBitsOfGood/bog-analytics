import streamlit as st
from data import visit_events  # Assuming visit_events is already imported
from widgets.sidebar_widgets import init_days_slider, init_event_selectbox
from widgets.visit_event_widgets import init_recent_events_table
from utils import EventTypes
import pandas as pd
from datetime import datetime, timedelta


def get_aggregated_visits(events, days=30):
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    filtered_events = [event for event in events if start_date <= datetime.fromisoformat(event.event_properties.date) <= end_date]

    
    page_visits = {}
    for event in filtered_events:
        page_url = event.event_properties.pageUrl
        if page_url in page_visits:
            page_visits[page_url] += 1
        else:
            page_visits[page_url] = 1

    return page_visits

st.title("Analytics Dashboard")
selected_event_type = init_event_selectbox(st)
days_aggregation = init_days_slider(st)

if selected_event_type == EventTypes.VISIT_EVENTS.value:
    init_recent_events_table(st, visit_events)
    page_visits = get_aggregated_visits(visit_events, days=days_aggregation)
    df_visits = pd.DataFrame(list(page_visits.items()), columns=['Page URL', 'Visits'])
    st.bar_chart(df_visits.set_index('Page URL'))

if selected_event_type == EventTypes.CLICK_EVENTS.value:
    pass

if selected_event_type == EventTypes.INPUT_EVENTS.value:
    pass

