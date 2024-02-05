from collections import defaultdict
from datetime import datetime
import streamlit as st
from data import visit_events
from widgets.sidebar_widgets import init_days_slider, init_event_selectbox
from widgets.visit_event_widgets import init_recent_events_table, init_page_visit_graph
from utils import EventTypes
import pandas as pd
from datetime import datetime, timedelta


def get_aggregated_visits(events, days=30):

    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    filtered_events = [
        event
        for event in events
        if start_date <= datetime.fromisoformat(event.event_properties.date) <= end_date
    ]

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
    init_page_visit_graph(st, visit_events)

if selected_event_type == EventTypes.CLICK_EVENTS.value:

    object_clicks = defaultdict(int)
    for click_event in click_events:
        object_id = click_event.event_properties.object_id
        object_clicks[object_id] += 1

    df_visits = pd.DataFrame(
        list(object_clicks.items()), columns=["Object Id", "Clicks"]
    )
    st.bar_chart(df_visits.set_index("Object Id"))
if selected_event_type == EventTypes.INPUT_EVENTS.value:
    pass
