export type ClientType = "VESSEL_OWNER" | "VESSEL_CHARTERER";

export interface MembershipSummary {
  clientId: string;
  clientType: ClientType;
}

export interface AppUser {
  id: string;
  roles: string[];
  memberships: MembershipSummary[];
}

export function isAdmin(user: AppUser): boolean {
  return user.roles.includes("BVS_ADMIN");
}

export function getPrimaryClientType(user: AppUser): ClientType | null {
  return user.memberships[0]?.clientType ?? null;
}
