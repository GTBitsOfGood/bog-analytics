import datetime
import time
import requests
from utils import EventTypes

base_url = "http://api:3001"


def get_default_after_time():
    thirty_days_ago = datetime.datetime.now() - datetime.timedelta(days=15)
    return int(time.mktime(thirty_days_ago.timetuple()))


def get_paginated_visit_events(
    project_name, after_time=get_default_after_time(), limit=10, after_id=None
):
    url = base_url + "/api/events/visit-event"
    params = {
        "projectName": project_name,
        "afterTime": after_time,
        "limit": limit,
    }
    if after_id:
        params["afterId"] = after_id

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # error
        return response.json()
    except requests.exceptions.RequestException as err:
        return {"success": False, "payload": {"error": str(err)}}


def get_visit_events(project_name, after_time):
    visit_events = []
    after_id = None
    while True:
        page = get_paginated_visit_events(project_name, after_time, 10, after_id)
        if page.get("success") and page.get("payload"):
            visit_events.extend(page["payload"]["events"])
            after_id = page["payload"].get("afterId")
            if after_id is None:
                break
        else:
            break
    return visit_events


def get_paginated_click_events(
    project_name, after_time=get_default_after_time(), limit=10, after_id=None
):
    url = base_url + "/api/events/click-event"
    params = {
        "projectName": project_name,
        "afterTime": after_time,
        "limit": limit,
    }
    if after_id:
        params["afterId"] = after_id

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # error
        return response.json()
    except requests.exceptions.RequestException as err:
        return {"success": False, "payload": {"error": str(err)}}


def get_click_events(project_name, after_time):
    click_events = []
    after_id = None
    while True:
        page = get_paginated_click_events(project_name, after_time, 10, after_id)
        if page.get("success") and page.get("payload"):
            click_events.extend(page["payload"]["events"])
            after_id = page["payload"].get("afterId")
            if after_id is None:
                break
        else:
            break
    return click_events


def get_paginated_input_events(
    project_name, after_time=get_default_after_time(), limit=10, after_id=None
):
    url = base_url + "/api/events/input-event"
    params = {
        "projectName": project_name,
        "afterTime": after_time,
        "limit": limit,
    }
    if after_id:
        params["afterId"] = after_id
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # error
        return response.json()
    except requests.exceptions.RequestException as err:
        return {"success": False, "payload": {"error": str(err)}}


def get_input_events(project_name, after_time):
    input_events = []
    after_id = None
    while True:
        page = get_paginated_input_events(project_name, after_time, 10, after_id)
        if page.get("success") and page.get("payload"):
            input_events.extend(page["payload"]["events"])
            after_id = page["payload"].get("afterId")
            if after_id is None:
                break
        else:
            break
    return input_events


def get_custom_event_types_by_project(project_name):
    custom_event_types_url = base_url + "/api/events/custom-event-type"
    params = {"projectName": project_name}
    try:
        response = requests.get(custom_event_types_url, params=params)
        response.raise_for_status()  # error
        return response.json()["payload"]
        return []
    except requests.exceptions.RequestException as err:
        return {"success": False, "payload": {"error": str(err)}}


def get_event_types(project_name):
    custom_event_types = get_custom_event_types_by_project(project_name)
    custom_subcategories = [
        custom_type["subcategory"] for custom_type in custom_event_types
    ]
    # When we have custom events, we will want to change this to include both default and custom events
    default_types = [member.value for member in EventTypes]
    default_types.extend(custom_subcategories)
    return default_types


def get_projects():
    # When we have the project api setup, we will want to retrieve real projects
    # return ["project_1", "project_2", "project_3"]

    project_url = base_url + "/api/project"
    response = requests.get(project_url)
    response.raise_for_status()  # error
    response = response.json()
    return [project["projectName"] for project in response["payload"]]
