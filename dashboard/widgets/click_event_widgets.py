from collections import defaultdict
import pandas as pd
import altair as alt


def init_object_click_bar_graph(st, click_events):
    st.write("**Clicks Per Object Graph**")
    st.write("The following graph shows the number of clicks per object.")
    object_clicks = defaultdict(int)
    for click_event in click_events:
        objectId = click_event["eventProperties"]["objectId"]
        object_clicks[objectId] += 1

    df_visits = pd.DataFrame(
        list(object_clicks.items()), columns=["Object Id", "Clicks"]
    )

    chart = (
        alt.Chart(df_visits)
        .mark_bar(color="#FF8A54")
        .encode(
            x=alt.X("Object Id", axis=alt.Axis(title="Object ID")),
            y=alt.Y("Clicks", axis=alt.Axis(title="Number of Clicks")),
        )
        .properties(width=600, height=400)
    )

    st.altair_chart(chart, use_container_width=True)


def init_object_active_users_bar_graph(st, click_events):
    st.write("#### **User Clicks Per Object Graph**")
    st.write(
        "This graph illustrates the number of clicks made by different users on a specific object."
    )
    user_clicks_per_object = defaultdict(lambda: defaultdict(int))
    for click_event in click_events:
        objectId = click_event["eventProperties"]["objectId"]
        userId = click_event["eventProperties"]["userId"]
        user_clicks_per_object[objectId][userId] += 1

    objectIds = list(user_clicks_per_object.keys())
    selected_objectId = st.selectbox("Select an Object to inspect", objectIds)

    clicks_data = user_clicks_per_object[selected_objectId]
    df_clicks = (
        pd.DataFrame(list(clicks_data.items()), columns=["User ID", "Clicks"])
        .sort_values(by="Clicks", ascending=False)
        .head(5)
    )

    chart = (
        alt.Chart(df_clicks)
        .mark_bar(color="#FFB654")
        .encode(
            x=alt.X("User ID", axis=alt.Axis(title="User ID")),
            y=alt.Y("Clicks", axis=alt.Axis(title="Number of Clicks")),
        )
        .properties(width=600, height=400)
    )

    st.altair_chart(chart, use_container_width=True)
