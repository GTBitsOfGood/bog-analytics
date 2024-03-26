from enum import Enum
from datetime import datetime, timedelta


class EventTypes(Enum):
    VISIT_EVENTS = "Visit Events"
    CLICK_EVENTS = "Click Events"
    INPUT_EVENTS = "Input Events"


def get_iso_string_n_days_ago(n):
    today = datetime.now()
    print(today)
    n_days_ago = today - timedelta(days=n)
    iso_string = n_days_ago.isoformat()

    return iso_string
