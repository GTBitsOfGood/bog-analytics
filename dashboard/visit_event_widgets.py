import pandas as pd


def init_recent_events_table(st, visit_events):
    visit_sorted = sorted(visit_events, key=lambda event: event.event_properties.date)
    data = [
        {
            "Page URL": event.event_properties.pageUrl,
            "User ID": event.event_properties.user_id,
            "Date": event.event_properties.date,
        }
        for event in visit_sorted
    ]

    df = pd.DataFrame(data)
    df["Date"] = pd.to_datetime(df["Date"])
    df["Date"] = df["Date"].dt.strftime("%B %d, %Y %I:%M %p")

    df = df.sort_values(by="Date", ascending=False)
    df = df.head(5)
    st.table(df)
