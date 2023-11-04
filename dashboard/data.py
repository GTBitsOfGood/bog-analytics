import datetime
import random

class BaseEvent:
	def __init__(self, event_properties, category, subcategory) -> None:
		self.category = category
		self.subcategory = subcategory
		self.event_properties = event_properties

class VisitEventProperties:
	def __init__(self, pageUrl, userId, date) -> None:
		self.pageUrl = pageUrl
		self.userId = userId
		self.date = date

class VisitEvent(BaseEvent):
	def __init__(self, event_properties, category='Activity', subcategory='Visit') -> None:
		super().__init__(event_properties, category, subcategory)

class ClickEventProperties:
	def __init__(self, objectId, userId) -> None:
		self.objectId = objectId
		self.userId = userId

class ClickEvent(BaseEvent):
	def __init__(self, event_properties, category='Interaction', subcategory='Click') -> None:
		super().__init__(event_properties, category, subcategory)

class InputEventProperties:
	def __init__(self, objectId, userId) -> None:
		self.objectId = objectId
		self.userId = userId

class InputEvent(BaseEvent):
	def __init__(self, event_properties, category='Interaction', subcategory='Input') -> None:
		super().__init__(event_properties, category, subcategory)

possible_urls = ['/home', '/app', '/contact', '/dashboard']
possible_buttons = [f'button_{i}' for i in range(0, 5)]
possible_inputs = [f'input_{i}' for i in range(0, 5)]
possible_users = [f'user_{i}' for i in range(0, 100)]
possible_dates = [(datetime.datetime.now() - datetime.timedelta(days=i)).isoformat() for i in range(30)]

visit_events = []
click_events = []
input_events = []
for i in range(0, 100):
	visit_properties = VisitEventProperties(
		pageUrl=random.choice(possible_urls), 
		userId=random.choice(possible_users), 
		date=random.choice(possible_dates)
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
	)

	input_events.append(InputEvent(input_properties))