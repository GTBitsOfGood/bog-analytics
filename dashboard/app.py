import streamlit as st
from data import visit_events, click_events, input_events, custom_events, custom_graphs
from widgets.sidebar_widgets import (
    init_days_slider,
    init_event_selectbox,
    init_project_selectbox,
)
from widgets.visit_event_widgets import (
    init_recent_events_table,
    init_page_visit_graph,
    init_page_active_users_graph,
)
from widgets.click_event_widgets import (
    init_object_click_bar_graph,
    init_object_active_users_bar_graph,
)
from utils import EventTypes

st.title("Analytics Dashboard")
selected_project = init_project_selectbox(st)
selected_event_type = init_event_selectbox(st, selected_project)
days_aggregation = init_days_slider(st, selected_event_type)

if selected_event_type == EventTypes.VISIT_EVENTS.value:
    init_recent_events_table(st, visit_events)
    init_page_visit_graph(st, visit_events)
    init_page_active_users_graph(st, visit_events)

if selected_event_type == EventTypes.CLICK_EVENTS.value:
    init_object_click_bar_graph(st, click_events)
    init_object_active_users_bar_graph(st, click_events)

if selected_event_type == EventTypes.INPUT_EVENTS.value:
    pass
