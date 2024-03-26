import requests
import random

random.seed(0)
base_url = "http://localhost:3001"


def create_project(project_name):
    url = base_url + "/api/project"
    body = {
        "projectName": project_name,
    }

    try:
        response = requests.post(url, json=body)
        response.raise_for_status()
        project = response.json()["payload"]
        return project
    except requests.exceptions.RequestException as e:
        print(f"Failed to create project {project_name}: {e}")
        return None


def create_click_event(client_token, project_id, objectId, userId):
    url = base_url + "/api/events/click-event"
    headers = {"clienttoken": client_token}
    body = {
        "projectId": project_id,
        "objectId": objectId,
        "userId": userId
    }

    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating click event: {e}")
        return None


def create_input_event(client_token, project_id, objectId, userId, textValue):
    url = base_url + "/api/events/input-event"
    headers = {"clienttoken": client_token}
    body = {
        "projectId": project_id,
        "objectId": objectId,
        "userId": userId,
        "textValue": textValue
    }

    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating input event: {e}")
        return None


def create_visit_event(client_token, project_id, pageUrl, userId, date=None):
    url = base_url + "/api/events/visit-event"
    headers = {"clienttoken": client_token}
    body = {
        "projectId": project_id,
        "pageUrl": pageUrl,
        "userId": userId
    }
    if date:
        body["date"] = date

    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating visit event: {e}")
        return None


def create_custom_event(client_token, event_type_id, properties):
    url = base_url + "/api/events/custom-event"
    headers = {"clienttoken": client_token}
    body = {
        "eventTypeId": event_type_id,
        "properties": properties
    }

    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()  # Raises an exception for HTTP errors
        return response.json()["payload"]
    except requests.exceptions.RequestException as e:
        print(f"Error creating custom event: {e}")
        return None


def create_custom_event_type(server_token, category, subcategory, properties):
    url = base_url + "/api/events/custom-event-type"
    headers = {"servertoken": server_token}
    body = {
        "category": category,
        "subcategory": subcategory,
        "properties": properties,
    }

    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        return response.json()["payload"]
    except requests.exceptions.RequestException as e:
        print(f"Error creating custom event type: {e}")
        return None


def create_custom_graph_type(server_token, event_type_id, x_property, y_property, graph_type):
    url = base_url + "/api/graphs/custom-graph-type"
    headers = {"servertoken": server_token}
    body = {
        "eventTypeId": event_type_id,
        "xProperty": x_property,
        "yProperty": y_property,
        "graphType": graph_type,
    }

    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        return response.json()["payload"]
    except requests.exceptions.RequestException as e:
        print(f"Error creating custom graph type: {e}")
        return None


def seed():
    print("Creating Projects")
    projects = []
    for i in range(100):
        project = create_project(f"Project_{i}")
        if project:
            projects.append(project)
    
    for _ in range(1000):
        project = random.choice(projects)
        create_click_event(project['clientToken'], project['_id'], {"objectId": "obj1", "userId": "user1"})
        create_visit_event(project['clientToken'], project['_id'], {"pageUrl": "", "userId": "user2"})
        create_input_event(project['clientToken'], project['_id'], {"objectId": "obj2", "userId": "user3", "textValue": "Hello"})

    
    custom_event_types = []
    for i in range(10):
        project = random.choice(projects)
        event_type = create_custom_event_type(project['serverToken'], {"category": f"Category_{i}", "subcategory": f"Subcategory_{i}", "properties": [f"prop{i}" for i in range(random.randint(1, 5))]})
        custom_event_types.append(event_type)

    
    for _ in range(10000):
        event_type = random.choice(custom_event_types)
        project = random.choice(projects)  
        create_custom_event(project['clientToken'], project['_id'], event_type['_id'], {prop: f"value{random.randint(1, 100)}" for prop in event_type['properties']})

    
    for _ in range(100):
        event_type = random.choice(custom_event_types)
        project = random.choice(projects)
        props = event_type['properties']
        if len(props) < 2: continue  
        create_custom_graph_type(project['serverToken'], {"eventTypeId": event_type['_id'], "xProperty": random.choice(props), "yProperty": random.choice(props), "graphType": "line"})

    


if __name__ == "__main__":
    print("Seeding Database")
    seed()
