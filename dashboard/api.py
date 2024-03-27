import datetime
import time
import requests
from utils import EventTypes

base_url = "http://api:3001"
event_type_labels_to_event_mapping = {}


def get_default_after_time():
    thirty_days_ago = datetime.datetime.now() - datetime.timedelta(days=15)
    return int(time.mktime(thirty_days_ago.timetuple()))


def get_paginated_visit_events(
    project_name,
    after_time=get_default_after_time(),
    limit=10,
    after_id=None,
    environment=None,
):
    url = base_url + "/api/events/visit-event"
    params = {
        "projectName": project_name,
        "afterTime": after_time,
        "limit": limit,
    }
    if after_id:
        params["afterId"] = after_id

    if environment:
        params["environment"] = environment

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # error
        return response.json()
    except requests.exceptions.RequestException as err:
        return {"success": False, "payload": {"error": str(err)}}


def get_visit_events(project_name, after_time, environment):
    visit_events = []
    after_id = None
    while True:
        page = get_paginated_visit_events(
            project_name,
            after_time,
            100,
            after_id,
            environment if environment != "all" else None,
        )
        if page.get("success") and page.get("payload"):
            visit_events.extend(page["payload"]["events"])
            after_id = page["payload"].get("afterId")
            if after_id is None:
                break
        else:
            break
    return visit_events


def get_paginated_click_events(
    project_name,
    after_time=get_default_after_time(),
    limit=10,
    after_id=None,
    environment=None,
):
    url = base_url + "/api/events/click-event"
    params = {
        "projectName": project_name,
        "afterTime": after_time,
        "limit": limit,
    }
    if after_id:
        params["afterId"] = after_id

    if environment:
        params["environment"] = environment
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # error
        return response.json()
    except requests.exceptions.RequestException as err:
        return {"success": False, "payload": {"error": str(err)}}


def get_click_events(project_name, after_time, environment):
    click_events = []
    after_id = None
    while True:
        page = get_paginated_click_events(
            project_name,
            after_time,
            100,
            after_id,
            environment if environment != "all" else None,
        )
        if page.get("success") and page.get("payload"):
            click_events.extend(page["payload"]["events"])
            after_id = page["payload"].get("afterId")
            if after_id is None:
                break
        else:
            break
    return click_events


def get_paginated_input_events(
    project_name,
    after_time=get_default_after_time(),
    limit=10,
    after_id=None,
    environment=None,
):
    url = base_url + "/api/events/input-event"
    params = {
        "projectName": project_name,
        "afterTime": after_time,
        "limit": limit,
    }
    if after_id:
        params["afterId"] = after_id

    if environment:
        params["environment"] = environment
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # error
        return response.json()
    except requests.exceptions.RequestException as err:
        return {"success": False, "payload": {"error": str(err)}}


def get_input_events(project_name, after_time, environment):
    input_events = []
    after_id = None
    while True:
        page = get_paginated_input_events(
            project_name,
            after_time,
            100,
            after_id,
            environment if environment != "all" else None,
        )
        if page.get("success") and page.get("payload"):
            input_events.extend(page["payload"]["events"])
            after_id = page["payload"].get("afterId")
            if after_id is None:
                break
        else:
            break
    return input_events


def get_paginated_custom_events(
    project_name,
    category,
    subcategory,
    after_time=get_default_after_time(),
    limit=10,
    after_id=None,
    environment=None,
):
    url = base_url + "/api/events/custom-event"
    params = {
        "projectName": project_name,
        "category": category,
        "subcategory": subcategory,
        "afterTime": after_time,
        "limit": limit,
    }
    if after_id:
        params["afterId"] = after_id

    if environment:
        params["environment"] = environment

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # error
        return response.json()
    except requests.exceptions.RequestException as err:
        return {"success": False, "payload": {"error": str(err)}}


def get_custom_events(project_name, category, subcategory, after_time, environment):
    custom_events = []
    after_id = None
    while True:
        page = get_paginated_custom_events(
            project_name,
            category,
            subcategory,
            after_time,
            100,
            after_id,
            environment if environment != "all" else None,
        )
        if page.get("success") and page.get("payload"):
            custom_events.extend(page["payload"]["events"])
            after_id = page["payload"].get("afterId")
            if after_id is None:
                break
        else:
            break
    return custom_events


def get_custom_event_types_by_project(project_name):
    custom_event_types_url = base_url + "/api/events/custom-event-type"
    params = {"projectName": project_name}
    try:
        response = requests.get(custom_event_types_url, params=params)
        response.raise_for_status()  # error
        return response.json()["payload"]
    except requests.exceptions.RequestException as err:
        return {"success": False, "payload": {"error": str(err)}}


def get_custom_graphs_by_event(project_name, event_type_id):
    url = base_url + "/api/graphs/custom-graph-type"
    params = {"projectName": project_name, "eventTypeId": event_type_id}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # error
        return response.json()["payload"]
    except requests.exceptions.RequestException as err:
        return {"success": False, "payload": {"error": str(err)}}


def get_event_types(project_name):
    custom_event_types = get_custom_event_types_by_project(project_name)

    for custom_type in custom_event_types:
        event_type_labels_to_event_mapping[
            f"{custom_type['category']} - {custom_type['subcategory']}"
        ] = custom_type
    # When we have custom events, we will want to change this to include both default and custom events
    default_types = [member.value for member in EventTypes]
    default_types.extend(event_type_labels_to_event_mapping.keys())
    return default_types


def get_projects():
    # When we have the project api setup, we will want to retrieve real projects
    # return ["project_1", "project_2", "project_3"]

    project_url = base_url + "/api/project"
    response = requests.get(project_url)
    response.raise_for_status()  # error
    response = response.json()
    return [project["projectName"] for project in response["payload"]]
