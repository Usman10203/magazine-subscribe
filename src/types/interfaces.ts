export interface Plan {
    _id: string;
    title: string;
    description: string;
    renewalPeriod: number;
    tier: number;
    discount: number;
    priceAfterDiscount: number;
}

export interface Magazine {
    _id: string;
    name: string;
    description: string;
    base_price: number;
    plans: Plan[];
}
export interface Subscription {
    magazine_id: string;
    plan_id: string;
}


export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
}
