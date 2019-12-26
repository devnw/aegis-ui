export class OrgRequest {
  organization: Organization;
}

export class Organization {
  org_id: string;
  code: string;
  description: string;
  timezone_offset: number;
  id: number;
}
