import streamlit as st
import pandas as pd

def init_input_object_frequency_graph(st, input_events):
    df = pd.DataFrame([event.event_properties.__dict__ for event in input_events])
    object_counts = df['object_id'].value_counts().sort_values(ascending=False)
    st.bar_chart(object_counts)