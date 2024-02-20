import streamlit as st
#from data import visit_events, click_events, input_events, custom_events, custom_graphs
from data import visit_events, click_events, input_events
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

def add_graph_titles():
    if selected_event_type == EventTypes.VISIT_EVENTS.value:
        st.header("Visit Events")
        init_recent_events_table(st, visit_events)
        st.subheader("Page Visit Graph")
        init_page_visit_graph(st, visit_events)
        st.subheader("Page Active Users Graph")
        init_page_active_users_graph(st, visit_events)

    elif selected_event_type == EventTypes.CLICK_EVENTS.value:
        st.header("Click Events")
        st.subheader("Object Click Bar Graph")
        init_object_click_bar_graph(st, click_events)
        st.subheader("Object Active Users Bar Graph")
        init_object_active_users_bar_graph(st, click_events)

    elif selected_event_type == EventTypes.INPUT_EVENTS.value:
        st.header("Input Events")
        pass
        # Add input event graphs here if applicable

# Add titles and labels to graphs
add_graph_titles()


# Additional layout refinements
st.sidebar.markdown("---")  # Add a divider in the sidebar
st.sidebar.subheader("Dashboard Settings")  # Add a subheader in the sidebar
st.sidebar.info("Use the sidebar to adjust settings.") 
st.sidebar.markdown("---")  # Add another divider in the sidebar


st.markdown("---")  
st.caption("This is a Streamlit Analytics Dashboard. BITS OF GOOD")

""" if selected_event_type == EventTypes.VISIT_EVENTS.value:
    init_recent_events_table(st, visit_events)
    init_page_visit_graph(st, visit_events)
    init_page_active_users_graph(st, visit_events)

if selected_event_type == EventTypes.CLICK_EVENTS.value:
    init_object_click_bar_graph(st, click_events)
    init_object_active_users_bar_graph(st, click_events)

if selected_event_type == EventTypes.INPUT_EVENTS.value:
    pass
 """