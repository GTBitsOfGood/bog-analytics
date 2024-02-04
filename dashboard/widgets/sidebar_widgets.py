from utils import EventTypes


def init_event_selectbox(st):
    return st.sidebar.selectbox(
        "Select Event Type", [member.value for member in EventTypes]
    )


def init_days_slider(st):
    with st.sidebar:
        # days-toggle slider
        return st.slider(
            label="Select Data Timeframe",
            min_value=1,
            max_value=30,
            value=15,  # Default value of the slider
        )
