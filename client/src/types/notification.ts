export type NotificationType = 'new_menu' | 'item_added' | 'item_status_change';

export interface Notification {
    id: number;
    // notification_type: NotificationType;
    notification_data: string;
    notification_timestamp: Date;
    itemName: string;
}
