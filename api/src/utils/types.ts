import {
    Document
} from 'mongoose';

export interface BaseEvent extends Document {
    category: string;
    subcategory: string;
}

export interface ClickEvent extends BaseEvent {
    eventProperties: ClickEventProperties
}

export interface ClickEventProperties {
    objectId: string;
    userId: string;
}