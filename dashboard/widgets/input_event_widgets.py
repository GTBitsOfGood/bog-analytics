import pandas as pd
import altair as alt


def init_input_object_frequency_graph(st, input_events):
    st.write("**Input Object Frequency Graph**")
    df = pd.DataFrame([vars(event.event_properties) for event in input_events])

    object_counts = (
        df["object_id"].value_counts().rename_axis("x").reset_index(name="y")
    )
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
