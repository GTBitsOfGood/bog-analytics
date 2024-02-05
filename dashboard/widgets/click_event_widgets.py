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
