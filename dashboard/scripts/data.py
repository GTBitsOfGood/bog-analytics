import datetime
import random


class BaseEvent:
    def __init__(self, event_properties, category, subcategory) -> None:
        self.category = category
        self.subcategory = subcategory
        self.event_properties = event_properties


class VisitEventProperties:
    def __init__(self, pageUrl, user_id, date) -> None:
        self.pageUrl = pageUrl
        self.user_id = user_id
        self.date = date


class VisitEvent(BaseEvent):
    def __init__(
        self, event_properties, category="Activity", subcategory="Visit"
    ) -> None:
        super().__init__(event_properties, category, subcategory)


class ClickEventProperties:
    def __init__(self, object_id, user_id) -> None:
        self.object_id = object_id
        self.user_id = user_id


class ClickEvent(BaseEvent):
    def __init__(
        self, event_properties, category="Interaction", subcategory="Click"
    ) -> None:
        super().__init__(event_properties, category, subcategory)


class InputEventProperties:
    def __init__(self, object_id, user_id, text_value) -> None:
        self.object_id = object_id
        self.user_id = user_id
        self.text_value = text_value


class InputEvent(BaseEvent):
    def __init__(
        self, event_properties, category="Interaction", subcategory="Input"
    ) -> None:
        super().__init__(event_properties, category, subcategory)


possible_custom_properties = [f"prop{i}" for i in range(0, 5)]


class CustomEvent(BaseEvent):
    def __init__(self, event_properties, category, subcategory) -> None:
        super().__init__(event_properties, category, subcategory)


class CustomGraphType:
    def __init__(self, category, subcategory, xProperty, yProperty, graphType) -> None:
        self.category = category
        self.subcategory = subcategory
        self.xProperty = xProperty
        self.yProperty = yProperty
        self.graphType = graphType


random.seed(0)

possible_urls = ["/home", "/app", "/contact", "/dashboard"]
possible_buttons = [f"button_{i}" for i in range(0, 5)]
possible_inputs = [f"input_{i}" for i in range(0, 5)]
possible_users = [f"user_{i}" for i in range(0, 100)]
possible_text_values = [f"text_{i}" for i in range(0, 5)]
possible_dates = [
    (datetime.datetime.now() - datetime.timedelta(days=i)).isoformat()
    for i in range(30)
]

possible_custom_event_categories = [f"custom{i}" for i in range(0, 2)]
possible_custom_event_subcategories = [f"custom{i}" for i in range(0, 2)]
graph_types = ["bar", "line", "scatter"]

visit_events = []
click_events = []
input_events = []
custom_events = []
custom_graphs = []

for i in range(0, 100):
    visit_properties = VisitEventProperties(
        pageUrl=random.choice(possible_urls),
        user_id=random.choice(possible_users),
        date=random.choice(possible_dates),
    )
    visit_events.append(VisitEvent(visit_properties))

    click_properties = ClickEventProperties(
        object_id=random.choice(possible_buttons),
        user_id=random.choice(possible_users),
    )

    click_events.append(ClickEvent(click_properties))

    input_properties = InputEventProperties(
        object_id=random.choice(possible_inputs),
        user_id=random.choice(possible_users),
        text_value=random.choice(possible_text_values),
    )

    input_events.append(InputEvent(input_properties))

    custom_properties = {}
    for prop in possible_custom_properties:
        custom_properties[prop] = random.choice([i for i in range(10)])

    custom_event = CustomEvent(
        custom_properties,
        random.choice(possible_custom_event_categories),
        random.choice(possible_custom_event_subcategories),
    )

    custom_events.append(custom_event)

created_graphs = set()
for i in range(0, 10):
    cat = random.choice(possible_custom_event_categories)
    subcat = random.choice(possible_custom_event_subcategories)
    xProp = random.choice(possible_custom_properties)
    yProp = random.choice(possible_custom_properties)
    graphType = random.choice(graph_types)

    if f"{cat}{subcat}{xProp}{yProp}{graphType}" in created_graphs:
        continue

    created_graphs.add(f"{cat}{subcat}{xProp}{yProp}{graphType}")

    custom_graphs.append(
        CustomGraphType(
            cat,
            subcat,
            xProp,
            yProp,
            graphType,
        )
    )
