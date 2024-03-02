import requests

base_url = "http://localhost:3001"
SERVER_API_KEY = ""
CLIENT_API_KEY = ""


def create_project(project_name):
    url = base_url + "/api/project"
    body = {
        "projectName": project_name,
    }

    try:
        response = requests.post(url, json=body)
        response.raise_for_status()
        project = response.json()["payload"]

        global SERVER_API_KEY, CLIENT_API_KEY
        SERVER_API_KEY = project["serverApiKey"]
        CLIENT_API_KEY = project["clientApiKey"]
        return response.json()
    except requests.exceptions.RequestException as err:
        return {"success": False, "payload": {"error": str(err)}}


def create_click_event():
    pass


def create_input_event():
    pass


def create_visit_event():
    pass


def create_custom_event():
    pass


def create_custom_graph():
    pass


def seed():
    print("Creating Example Project")
    create_project("Example Project")
    pass


if __name__ == "__main__":
    print("Seeding Database")
    seed()
