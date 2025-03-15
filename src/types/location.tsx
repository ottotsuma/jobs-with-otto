export type Location = {
    id: number;
    name: string;
    address: string;
    company_id: string; // UUID as string
};

export type NewLocationType = Omit<Location, "id">;
