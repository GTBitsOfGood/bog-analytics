import altair as alt
import pandas as pd
import streamlit as st

def init_input_object_frequency_graph(st, input_events):
    
    df = pd.DataFrame([event.event_properties.__dict__ for event in input_events])
    
    object_counts = df['object_id'].value_counts().reset_index()
    object_counts.columns = ['object_id', 'count']
    object_counts = object_counts.sort_values(by='count', ascending=False)

    chart = (
        alt.Chart(object_counts)
        .mark_bar(color="#FF8A54")
        .encode(
            x=alt.X('object_id:N', sort='-y', title='Object ID'), 
            y=alt.Y('count:Q', title='Frequency'),
        )
        .properties(width='container', height=400) 
    )

    st.altair_chart(chart, use_container_width=True)