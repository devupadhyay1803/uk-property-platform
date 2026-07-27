-- Allow tenants to read the profiles of landlords they are renting from
create policy "tenant reads landlord profile" on public.profiles
  for select using (
    id in (
      select p.landlord_id from public.properties p
      join public.tenant_records tr on tr.property_id = p.id
      where tr.profile_id = auth.uid()
    )
  );
