import altair as alt
import pandas as pd
import streamlit as st

def init_input_object_frequency_graph(st, input_events):
    st.write("**Input Object Frequency Graph**")
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

def init_input_value_frequency_graph(st, input_events):
    st.write("**Text Value Frequency Graph for Selected Object**")
    df = pd.DataFrame([vars(event.eventProperties) for event in input_events])

    # create a select box for the user to select an object
    unique_objects = df["objectId"].unique()
    selected_object = st.selectbox("Select an Object", unique_objects)
    filtered_df = df[df["objectId"] == selected_object]

    # bar chart w/desc order of frequency of each unique TextValue
    textValue_counts = (
        filtered_df["textValue"]
        .value_counts()
        .rename_axis("textValue")
        .reset_index(name="Frequency")
    )
    textValue_counts = textValue_counts.sort_values(by="Frequency", ascending=False)

    chart = (
        alt.Chart(textValue_counts)
        .mark_bar()
        .encode(
            x=alt.X("textValue", axis=alt.Axis(title="Text Value")),
            y=alt.Y("Frequency", axis=alt.Axis(title="Frequency")),
            tooltip=["textValue", "Frequency"],
        )
        .properties(width=600, height=400)
    )

    st.altair_chart(chart, use_container_width=True)
