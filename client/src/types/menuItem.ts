
export type MenuItemCategory = 'breakfast' | 'lunch' | 'dinner' | 'beverage';
export type MenuItemAvailabilityStatus = 'available' | 'unavailable';

export interface MenuItem {
    id?: number;
    name: string;
    price: number;
    availability_status: number;
    foodItemTypeId:number
}
