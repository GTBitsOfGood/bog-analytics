import requests

def get_visit_events(project_name, after_time, limit, after_id=None)
    url = "analytics.bitsofgood.org/api/events/visit-events"
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
        return {"error": "Request failed", "details": str(err)}

def visit_events()
    visit_events = []
    while True:
        page = get_visit_events(project_name, after_time, limit, after_id)
        if page.get('success') and page.get('payload'):
            visit_events.extend(page['payload']['events'])
            after_id = page['payload'].get('afterId')
            if after_id is None:
                break
        else:
            break
    return visit_events


def get_click_events(project_name, after_time, limit, after_id=None)
    url = "analytics.bitsofgood.org/api/events/click-events"
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
        return {"error": "Request failed", "details": str(err)}

def click_events()
    click_events = []
    while True:
        page = get_click_events(project_name, after_time, limit, after_id)
        if page.get('success') and page.get('payload'):
            click_events.extend(page['payload']['events'])
            after_id = page['payload'].get('afterId')
            if after_id is None:
                break
        else:
            break
    return click_events

def get_input_events(project_name, after_time, limit, after_id=None)
    url = "analytics.bitsofgood.org/api/events/input-events"
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
        return {"error": "Request failed", "details": str(err)}

def input_events()
    input_events = []
    while True:
        page = get_input_events(project_name, after_time, limit, after_id)
        if page.get('success') and page.get('payload'):
            input_events.extend(page['payload']['events'])
            after_id = page['payload'].get('afterId')
            if after_id is None:
                break
        else:
            break
    return input_events