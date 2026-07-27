/**
 * Hand-written to match supabase/migrations so the app type-checks before a
 * live DB exists. Uses `type` aliases (not interfaces) and includes
 * `Relationships` on each table so the shape satisfies supabase-js's
 * GenericSchema constraint (otherwise Insert/Row resolve to `never`).
 *
 * Once the DB is up, regenerate the authoritative version:
 *   supabase gen types typescript --local > types/database.ts
 */

export type UserRole = "tenant" | "landlord" | "admin";
export type PropertyStatus = "available" | "let";
export type TenancyStatus = "active" | "pending" | "past";
export type EnquiryStatus = "new" | "contacted" | "closed";
export type ServiceRequestStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed";

type Timestamps = { created_at: string; updated_at: string };

export type Profile = Timestamps & {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string | null;
};

export type Property = Timestamps & {
  id: string;
  landlord_id: string;
  title: string;
  slug: string;
  description: string | null;
  price_pcm: number;
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  address_line: string;
  city: string;
  postcode: string;
  latitude: number | null;
  longitude: number | null;
  status: PropertyStatus;
  published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  search_vector: string | null;
};

export type PropertyPhoto = {
  id: string;
  property_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
};

export type TenantRecord = Timestamps & {
  id: string;
  profile_id: string | null;
  property_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  status: TenancyStatus;
};

export type CommunicationLog = {
  id: string;
  tenant_record_id: string;
  author_id: string | null;
  note: string;
  created_at: string;
};

export type Enquiry = {
  id: string;
  property_id: string;
  landlord_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: EnquiryStatus;
  created_at: string;
};

export type ServiceRequest = Timestamps & {
  id: string;
  created_by: string;
  tenant_record_id: string | null;
  property_id: string | null;
  landlord_id: string | null;
  category: string | null;
  title: string;
  description: string;
  status: ServiceRequestStatus;
};

type Insert<T, Optional extends keyof T> = Omit<T, Optional> &
  Partial<Pick<T, Optional>>;

type TableDef<Row, Ins, Upd = Partial<Row>> = {
  Row: Row;
  Insert: Ins;
  Update: Upd;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<
        Profile,
        Insert<
          Profile,
          "created_at" | "updated_at" | "role" | "full_name" | "email" | "phone"
        >
      >;
      properties: TableDef<
        Property,
        Insert<
          Property,
          | "id"
          | "created_at"
          | "updated_at"
          | "search_vector"
          | "status"
          | "published"
          | "description"
          | "bedrooms"
          | "bathrooms"
          | "latitude"
          | "longitude"
          | "meta_title"
          | "meta_description"
        >
      >;
      property_photos: TableDef<
        PropertyPhoto,
        Insert<PropertyPhoto, "id" | "created_at" | "alt_text" | "sort_order">
      >;
      tenant_records: TableDef<
        TenantRecord,
        Insert<
          TenantRecord,
          | "id"
          | "created_at"
          | "updated_at"
          | "status"
          | "profile_id"
          | "property_id"
          | "email"
          | "phone"
        >
      >;
      communication_log: TableDef<
        CommunicationLog,
        Insert<CommunicationLog, "id" | "created_at" | "author_id">
      >;
      enquiries: TableDef<
        Enquiry,
        Insert<Enquiry, "id" | "created_at" | "status" | "landlord_id" | "phone">
      >;
      service_requests: TableDef<
        ServiceRequest,
        Insert<
          ServiceRequest,
          | "id"
          | "created_at"
          | "updated_at"
          | "status"
          | "tenant_record_id"
          | "property_id"
          | "landlord_id"
          | "category"
        >
      >;
    };
    Views: Record<string, never>;
    Functions: {
      auth_role: { Args: Record<string, never>; Returns: string };
    };
    Enums: {
      user_role: UserRole;
      property_status: PropertyStatus;
      tenancy_status: TenancyStatus;
      enquiry_status: EnquiryStatus;
      service_request_status: ServiceRequestStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
