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
    except requests.exceptions.RequestException:
        return None


def create_click_event():
    pass


def create_input_event():
    pass


def create_visit_event():
    pass


def create_custom_event():
    pass


def create_custom_event_type():
    pass


def create_custom_graph_type():
    pass


def seed():
    print("Creating Projects")
    create_project("Example Project")
    pass


if __name__ == "__main__":
    print("Seeding Database")
    seed()
