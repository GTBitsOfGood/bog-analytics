import datetime
import pandas as pd


def init_recent_events_table(st, visit_events):
    hide_table_row_index = """
        <style>
            thead tr th:first-child {display:none}
            tbody th {display:none}
        </style>
    """

    st.markdown(hide_table_row_index, unsafe_allow_html=True)

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


def init_page_visit_graph(st, visit_events):
    page_visits = {}
    for event in visit_events:
        page_url = event.event_properties.pageUrl
        if page_url in page_visits:
            page_visits[page_url] += 1
        else:
            page_visits[page_url] = 1

    df_visits = pd.DataFrame(list(page_visits.items()), columns=["Page URL", "Visits"])
    st.bar_chart(df_visits.set_index("Page URL"))
