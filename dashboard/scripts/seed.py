from collections import defaultdict
import requests
import random
import uuid

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


def create_click_event(client_token, object_id, user_id, environment):
    url = base_url + "/api/events/click-event"
    headers = {"clienttoken": client_token}
    body = {
        "objectId": object_id,
        "userId": user_id,
        "environment": environment,
    }

    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        return response.json()["payload"]
    except requests.exceptions.RequestException as e:
        print(f"Error creating click event: {e}")
        return None


def create_input_event(client_token, object_id, user_id, text_value, environment):
    url = base_url + "/api/events/input-event"
    headers = {"clienttoken": client_token}
    body = {
        "objectId": object_id,
        "userId": user_id,
        "textValue": text_value,
        "environment": environment,
    }

    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        return response.json()["payload"]
    except requests.exceptions.RequestException as e:
        print(f"Error creating input event: {e}")
        return None


def create_visit_event(client_token, page_url, user_id, environment):
    url = base_url + "/api/events/visit-event"
    headers = {"clienttoken": client_token}
    body = {
        "pageUrl": page_url,
        "userId": user_id,
        "environment": environment,
    }

    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating visit event: {e}")
        return None


def create_custom_event(client_token, event_type_id, properties, environment):
    url = base_url + "/api/events/custom-event"
    headers = {"clienttoken": client_token}
    body = {
        "eventTypeId": event_type_id,
        "properties": properties,
        "environment": environment,
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


def create_custom_graph_type(
    server_token, event_type_id, x_property, y_property, graph_title, graph_type
):
    url = base_url + "/api/graphs/custom-graph-type"
    headers = {"servertoken": server_token}
    body = {
        "eventTypeId": event_type_id,
        "xProperty": x_property,
        "yProperty": y_property,
        "graphTitle": graph_title,
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
    environments = ["development", "staging", "production"]
    users = [f"user_{i}" for i in range(0, 100)]
    objects = [f"object_{i}" for i in range(0, 100)]
    pages = [f"page_{i}" for i in range(0, 100)]
    texts = [f"text_{i}" for i in range(0, 100)]
    categories = [f"category_{i}" for i in range(0, 10)]
    subcategories = [f"subcategory_{i}" for i in range(0, 10)]
    properties = [f"prop_{i}" for i in range(0, 10)]
    property_values = [f"val_{i}" for i in range(0, 10)]
    graph_titles = [f"graph_title_{i}" for i in range(0, 100)]
    graph_types = ["bar", "line", "scatter"]

    num_projects = 10
    num_events = 1000
    num_custom_event_types = 10
    num_graph_types = 100

    print("Creating Projects")
    projects = []
    for i in range(num_projects):
        project = create_project(f"project_{i}_{str(uuid.uuid4())}")
        if project:
            projects.append(project)

    print("Creating Click Events")
    for _ in range(num_events):
        project = random.choice(projects)
        create_click_event(
            project["clientApiKey"],
            random.choice(objects),
            random.choice(users),
            random.choice(environments),
        )

    print("Creating Visit Events")
    for i in range(num_events):
        project = random.choice(projects)
        create_visit_event(
            project["clientApiKey"],
            random.choice(pages),
            random.choice(users),
            random.choice(environments),
        )

    print("Creating Input Events")
    for i in range(num_events):
        project = random.choice(projects)
        create_input_event(
            project["clientApiKey"],
            random.choice(objects),
            random.choice(users),
            random.choice(texts),
            random.choice(environments),
        )

    print("Creating Custom Event Types")
    custom_event_types = []
    project_to_event_types = defaultdict(list)
    for i in range(num_custom_event_types):
        project = random.choice(projects)
        event_type = create_custom_event_type(
            project["serverApiKey"],
            random.choice(categories),
            random.choice(subcategories),
            random.sample(properties, random.randint(2, len(properties))),
        )

        if not event_type:
            continue
        project_to_event_types[project["_id"]].append(event_type)
        custom_event_types.append(event_type)

    print("Creating Custom Events")
    for _ in range(num_events):
        project = random.choice(projects)
        while len(project_to_event_types[project["_id"]]) == 0:
            project = random.choice(projects)

        event_type = random.choice(project_to_event_types[project["_id"]])
        if not event_type:
            continue
        property_names = event_type["properties"]
        props = {}

        for prop in property_names:
            props[prop] = random.choice(property_values)

        create_custom_event(
            project["clientApiKey"],
            event_type["_id"],
            props,
            random.choice(environments),
        )

    print("Creating Graph Types")
    for _ in range(num_graph_types):
        project = random.choice(projects)

        while len(project_to_event_types[project["_id"]]) == 0:
            project = random.choice(projects)

        event_type = random.choice(project_to_event_types[project["_id"]])
        if not event_type:
            continue

        props = event_type["properties"]
        create_custom_graph_type(
            project["serverApiKey"],
            event_type["_id"],
            random.choice(props),
            random.choice(props),
            random.choice(graph_titles),
            random.choice(graph_types),
        )


if __name__ == "__main__":
    print("Seeding Database")
    seed()
