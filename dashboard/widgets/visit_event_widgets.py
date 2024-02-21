import datetime
import altair as alt
import pandas as pd
from collections import defaultdict


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
    st.write("**Recent Events Table**")
    st.table(df)


def init_page_visit_graph(st, visit_events):
    st.write("**Page Visit Frequency Graph**")
    page_visits = {}
    for event in visit_events:
        page_url = event.event_properties.pageUrl
        if page_url in page_visits:
            page_visits[page_url] += 1
        else:
            page_visits[page_url] = 1

    df_visits = pd.DataFrame(list(page_visits.items()), columns=["Page URL", "Visits"])

    # Create the bar chart
    chart = (
        alt.Chart(df_visits)
        .mark_bar()
        .encode(
            x=alt.X("Page URL", axis=alt.Axis(title="Page URL")),
            y=alt.Y("Visits", axis=alt.Axis(title="Number of Visits")),
        )
        .properties(width=600, height=400)
    )

    # Display the chart using Streamlit
    st.altair_chart(chart, use_container_width=True)


def init_page_active_users_graph(st, visit_events):
    st.write("**Page Specific User Visit Frequency Graph**")
    page_user_visits = defaultdict(lambda: defaultdict(int))
    for event in visit_events:
        page_url = event.event_properties.pageUrl
        user_id = event.event_properties.user_id
        page_user_visits[page_url][user_id] += 1

    page_urls = list(page_user_visits.keys())
    selected_page_url = st.selectbox("Select a Page to Inspect", page_urls)

    user_visits = page_user_visits[selected_page_url]

    df_user_visits = (
        pd.DataFrame(list(user_visits.items()), columns=["User ID", "Visits"])
        .sort_values(by="Visits", ascending=False)
        .head(5)
    )

    # Create the bar chart
    chart = (
        alt.Chart(df_user_visits)
        .mark_bar()
        .encode(
            x=alt.X("User ID", axis=alt.Axis(title="User ID")),
            y=alt.Y("Visits", axis=alt.Axis(title="Number of Visits")),
        )
        .properties(width=600, height=400)
    )

    # Display the chart using Streamlit
    st.altair_chart(chart, use_container_width=True)
