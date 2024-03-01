from collections import defaultdict
import pandas as pd
import altair as alt


def init_object_click_bar_graph(st, click_events):
    st.write("**Clicks Per Object Graph**")
    object_clicks = defaultdict(int)
    for click_event in click_events:
        object_id = click_event.event_properties.object_id
        object_clicks[object_id] += 1

    df_visits = pd.DataFrame(
        list(object_clicks.items()), columns=["Object Id", "Clicks"]
    )

    
    chart = (
        alt.Chart(df_visits)
        .mark_bar()
        .encode(
            x=alt.X("Object Id", axis=alt.Axis(title="Object ID")),
            y=alt.Y("Clicks", axis=alt.Axis(title="Number of Clicks")),
        )
        .properties(width=600, height=400)
    )

    
    st.altair_chart(chart, use_container_width=True)


def init_object_active_users_bar_graph(st, click_events):
    st.write("**User Clicks Per Object Graph**")
    user_clicks_per_object = defaultdict(lambda: defaultdict(int))
    for click_event in click_events:
        object_id = click_event.event_properties.object_id
        user_id = click_event.event_properties.user_id
        user_clicks_per_object[object_id][user_id] += 1

    object_ids = list(user_clicks_per_object.keys())
    selected_object_id = st.selectbox("Select an Object to inspect", object_ids)

    clicks_data = user_clicks_per_object[selected_object_id]
    df_clicks = (
        pd.DataFrame(list(clicks_data.items()), columns=["User ID", "Clicks"])
        .sort_values(by="Clicks", ascending=False)
        .head(5)
    )  

    
    chart = (
        alt.Chart(df_clicks)
        .mark_bar()
        .encode(
            x=alt.X("User ID", axis=alt.Axis(title="User ID")),
            y=alt.Y("Clicks", axis=alt.Axis(title="Number of Clicks")),
        )
        .properties(width=600, height=400)
    )

   
    st.altair_chart(chart, use_container_width=True)
