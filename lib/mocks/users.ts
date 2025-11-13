export type UserRole = "CUSTOMER" | "CUTTER";

export type User = {
  id: string;
  name: string;
  phone: string;
  address?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export const USERS: User[] = [
  {
    id: "65b100000000000000000001",
    name: "Marina Glass",
    phone: "+1-415-555-0123",
    address: "120 Market St, San Francisco, CA",
    role: "CUSTOMER",
    createdAt: "2025-02-03T09:15:00Z",
    updatedAt: "2025-02-03T09:15:00Z",
  },
  {
    id: "65b100000000000000000002",
    name: "Silver Coast Hospitality",
    phone: "+1-212-555-0188",
    role: "CUSTOMER",
    createdAt: "2025-02-05T11:40:00Z",
    updatedAt: "2025-02-05T11:40:00Z",
  },
  {
    id: "65b100000000000000000003",
    name: "Alex Romero",
    phone: "+1-415-555-0199",
    role: "CUTTER",
    createdAt: "2025-02-06T08:20:00Z",
    updatedAt: "2025-02-06T08:20:00Z",
  },
  {
    id: "65b100000000000000000004",
    name: "Priya Khanna",
    phone: "+1-650-555-0345",
    role: "CUTTER",
    createdAt: "2025-02-07T10:05:00Z",
    updatedAt: "2025-02-07T10:05:00Z",
  },
];

export function useMockUsers(role?: UserRole) {
  const data = role ? USERS.filter((user) => user.role === role) : USERS;
  return {
    data,
    isLoading: false,
  };
}

