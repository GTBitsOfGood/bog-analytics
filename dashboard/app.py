import streamlit as st
import pandas as pd
import numpy as np
from data import *

st.title('Hello World!')
EVENT_TYPES = [
    'Visit Events', 'Click Events', 'Input Events'
]
selected_event_type = st.sidebar.selectbox("Select Event Type", EVENT_TYPES)

print(selected_event_type)