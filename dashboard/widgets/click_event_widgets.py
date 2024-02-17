from collections import defaultdict
import pandas as pd


def init_object_click_bar_graph(st, click_events):
    object_clicks = defaultdict(int)
    for click_event in click_events:
        object_id = click_event.event_properties.object_id
        object_clicks[object_id] += 1

    df_visits = pd.DataFrame(
        list(object_clicks.items()), columns=["Object Id", "Clicks"]
    )
    st.bar_chart(df_visits.set_index("Object Id"))


def init_object_active_users_bar_graph(st, click_events):
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
    )  # Focus on top 5 users

    st.bar_chart(df_clicks.set_index("User ID"))
