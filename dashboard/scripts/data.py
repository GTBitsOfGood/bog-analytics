import datetime
import random

possible_dates = [
    (datetime.datetime.now() - datetime.timedelta(days=i)).isoformat()
    for i in range(30)
]


class BaseEvent:
    def __init__(self, eventProperties, category, subcategory) -> None:
        self.category = category
        self.subcategory = subcategory
        self.eventProperties = eventProperties
        self.createdAt = random.choice(possible_dates)


class VisitEventProperties:
    def __init__(self, pageUrl, userId) -> None:
        self.pageUrl = pageUrl
        self.userId = userId


class VisitEvent(BaseEvent):
    def __init__(
        self, eventProperties, category="Activity", subcategory="Visit"
    ) -> None:
        super().__init__(eventProperties, category, subcategory)


class ClickEventProperties:
    def __init__(self, objectId, userId) -> None:
        self.objectId = objectId
        self.userId = userId


class ClickEvent(BaseEvent):
    def __init__(
        self, eventProperties, category="Interaction", subcategory="Click"
    ) -> None:
        super().__init__(eventProperties, category, subcategory)


class InputEventProperties:
    def __init__(self, objectId, userId, textValue) -> None:
        self.objectId = objectId
        self.userId = userId
        self.textValue = textValue


class InputEvent(BaseEvent):
    def __init__(
        self, eventProperties, category="Interaction", subcategory="Input"
    ) -> None:
        super().__init__(eventProperties, category, subcategory)


possible_custom_properties = [f"prop{i}" for i in range(0, 5)]


class CustomEvent(BaseEvent):
    def __init__(self, eventProperties, category, subcategory) -> None:
        super().__init__(eventProperties, category, subcategory)


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
possible_textValues = [f"text_{i}" for i in range(0, 5)]

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
        userId=random.choice(possible_users),
    )
    visit_events.append(VisitEvent(visit_properties))

    click_properties = ClickEventProperties(
        objectId=random.choice(possible_buttons),
        userId=random.choice(possible_users),
    )

    click_events.append(ClickEvent(click_properties))

    input_properties = InputEventProperties(
        objectId=random.choice(possible_inputs),
        userId=random.choice(possible_users),
        textValue=random.choice(possible_textValues),
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
