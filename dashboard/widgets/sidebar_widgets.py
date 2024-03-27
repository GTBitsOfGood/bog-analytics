from api import get_event_types, get_projects
from utils import Environments
import pathlib


def init_project_selectbox(st):
    return st.sidebar.selectbox("📂 Select a Project", get_projects(), index=None)


def init_environment_selectbox(st):
    return st.sidebar.selectbox(
        "🌲 Select an Environment",
        ["All"] + [e.value for e in Environments],
        index=None,
    )


def init_event_selectbox(st, project_name=None):
    if not project_name:
        return None
    return st.sidebar.selectbox(
        "📌 Select Event Type", get_event_types(project_name), index=None
    )


def init_sidebar_description(st):
    st.sidebar.image(
        f"{pathlib.Path(__file__).parent.parent.resolve()}/images/bitsofgood_logo.jpeg",
        use_column_width=True,
    )
    st.sidebar.write(
        "The Bits of Good Unified Analytics Dashboard - Built Using Streamlit & Express.js"
    )
    st.sidebar.subheader("Dashboard Settings")
    st.sidebar.info("Use the sidebar to adjust settings", icon="ℹ️")
    st.sidebar.divider()


def init_days_slider(st, event_type=None):
    if not event_type:
        return None
    with st.sidebar:
        # days-toggle slider
        return st.slider(
            label="⏳ Select Data Timeframe (Days)",
            min_value=1,
            max_value=30,
            value=15,  # Default value of the slider
        )
