import pandas as pd
import altair as alt


def init_input_object_frequency_graph(st, input_events):
    st.write("**Input Object Frequency Graph**")
    df = pd.DataFrame([vars(event.eventProperties) for event in input_events])

    object_counts = df["objectId"].value_counts().rename_axis("x").reset_index(name="y")
    object_counts = object_counts.sort_values(by="y", ascending=False)

    chart = (
        alt.Chart(object_counts)
        .mark_bar()
        .encode(
            x=alt.X("x", axis=alt.Axis(title="Object ID")),
            y=alt.Y("y", axis=alt.Axis(title="Number of Inputs")),
        )
        .properties(width=600, height=400)
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
