import streamlit as st
import pandas as pd
from scripts.data import (
    # visit_events,
    # click_events,
    # input_events,
    custom_events,
    custom_graphs,
)
from widgets.sidebar_widgets import (
    init_days_slider,
    init_event_selectbox,
    init_project_selectbox,
    init_sidebar_description,
)
from widgets.visit_event_widgets import (
    init_recent_events_table,
    init_page_visit_graph,
    init_page_active_users_graph,
    init_visitors_over_time_graph,
)
from widgets.click_event_widgets import (
    init_object_click_bar_graph,
    init_object_active_users_bar_graph,
)

from utils import EventTypes

col1, col2 = st.columns([1, 5])

with col1:
    st.image("bog_mainlogo.jpeg", width=100)

with col2:
    st.markdown(
        """
<h1 style='text-align: left;'>BITS OF GOOD <br/>Analytics Dashboard</h1>
""",
        unsafe_allow_html=True,
    )

st.markdown(
    """Learn more about Bits of Good Projects @
[https://bitsofgood.org](https://bitsofgood.org/)
""",
    unsafe_allow_html=True,
)
st.caption(
    "This is the unified Bits of Good Streamlit Analytics Dashboard. The functionality of this dashboard is aimed to be interoperable and ingest data from our websites to reprocess it into a unified interface."
)
from widgets.input_event_widgets import (
    init_input_object_frequency_graph,
    init_input_value_frequency_graph,
)
from widgets.custom_event_graphs import init_plot_custom_graphs

from api import get_visit_events, get_click_events, get_input_events
from utils import *

st.title("Analytics Dashboard")
st.caption("This is the Bits of Good Streamlit analytics dashboard")
hide_st_style = """
            <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            header {visibility: hidden;}
            div.embeddedAppMetaInfoBar_container__DxxL1 {visibility: hidden;}
            </style>
            """
st.markdown(hide_st_style, unsafe_allow_html=True)

init_sidebar_description(st)
selected_project = init_project_selectbox(st)
selected_event_type = init_event_selectbox(st, selected_project)
days_ago = init_days_slider(st, selected_event_type)
visit_events = None

if days_ago:
    time_iso_string = get_iso_string_n_days_ago(int(days_ago))

if selected_event_type == EventTypes.VISIT_EVENTS.value:
    visit_events = None
    if days_ago:
        visit_events = get_visit_events(selected_project, time_iso_string)

    if visit_events:
        st.header("⭐ Visit Events")
        init_recent_events_table(st, visit_events)
        init_page_visit_graph(st, visit_events)
        init_page_active_users_graph(st, visit_events)
        init_visitors_over_time_graph(st, visit_events)
elif selected_event_type == EventTypes.CLICK_EVENTS.value:
    click_events = None
    if days_ago:
        click_events = get_click_events(selected_project, time_iso_string)

    if click_events:
        st.header("⭐ Click Events")
        init_object_click_bar_graph(st, click_events)
        init_object_active_users_bar_graph(st, click_events)
elif selected_event_type == EventTypes.INPUT_EVENTS.value:
    input_events = None
    if days_ago:
        input_events = get_input_events(selected_project, time_iso_string)

    if input_events:
        st.header("⭐ Input Events")
        init_input_object_frequency_graph(st, input_events)
        init_input_value_frequency_graph(st, input_events)

# elif selected_event_type == EventTypes.CUSTOM_EVENTS.value:
#     custom_charts = init_plot_custom_graphs(custom_events, custom_graphs)
#     for chart in custom_charts:
#         st.altair_chart(chart, use_container_width=True)