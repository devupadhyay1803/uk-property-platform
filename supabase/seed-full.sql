-- ============================================================================
-- UK Property Platform — Full seed with 18 sample listings + photos
-- Run this in your Supabase SQL Editor AFTER the schema migration.
-- Uses the landlord user created by setup-users.js (landlord@gmail.com).
-- ============================================================================

-- Step 1: Find the landlord's profile ID dynamically
-- (Falls back to the first landlord profile if landlord@gmail.com doesn't exist)
do $$
declare
  v_landlord_id uuid;
begin
  -- Try to find landlord@gmail.com first
  select id into v_landlord_id
  from public.profiles
  where role = 'landlord'
  limit 1;

  if v_landlord_id is null then
    raise exception 'No landlord profile found. Please create a landlord user first.';
  end if;

  raise notice 'Using landlord ID: %', v_landlord_id;

  -- Step 2: Delete existing sample data (safe re-run)
  delete from public.property_photos where property_id in (
    select id from public.properties where slug like '%-seed'
    or slug in (
      'elegant-2-bed-flat-kensington',
      'charming-3-bed-victorian-terrace-bristol',
      'modern-studio-mediacityuk-salford',
      'spacious-4-bed-detached-harrogate',
      'luxury-1-bed-canary-wharf',
      'cosy-2-bed-cottage-cotswolds',
      'penthouse-rooftop-terrace-manchester',
      'refurbished-1-bed-edinburgh-new-town',
      'waterfront-2-bed-cardiff-bay',
      '3-bed-semi-detached-solihull',
      'converted-loft-studio-shoreditch',
      'seaside-3-bed-townhouse-brighton',
      '2-bed-garden-flat-nottingham',
      'executive-4-bed-virginia-water',
      '1-bed-riverside-flat-glasgow',
      'period-5-bed-bath-royal-crescent',
      '2-bed-new-build-cambridge',
      'converted-barn-peak-district'
    )
  );

  delete from public.properties where slug in (
    'elegant-2-bed-flat-kensington',
    'charming-3-bed-victorian-terrace-bristol',
    'modern-studio-mediacityuk-salford',
    'spacious-4-bed-detached-harrogate',
    'luxury-1-bed-canary-wharf',
    'cosy-2-bed-cottage-cotswolds',
    'penthouse-rooftop-terrace-manchester',
    'refurbished-1-bed-edinburgh-new-town',
    'waterfront-2-bed-cardiff-bay',
    '3-bed-semi-detached-solihull',
    'converted-loft-studio-shoreditch',
    'seaside-3-bed-townhouse-brighton',
    '2-bed-garden-flat-nottingham',
    'executive-4-bed-virginia-water',
    '1-bed-riverside-flat-glasgow',
    'period-5-bed-bath-royal-crescent',
    '2-bed-new-build-cambridge',
    'converted-barn-peak-district'
  );

  -- Step 3: Insert 18 properties
  insert into public.properties
    (landlord_id, title, slug, description, price_pcm, property_type,
     bedrooms, bathrooms, address_line, city, postcode,
     latitude, longitude, status, published, meta_title, meta_description)
  values
    -- 1. Kensington
    (v_landlord_id,
     'Elegant 2-Bed Flat in Kensington',
     'elegant-2-bed-flat-kensington',
     'A beautifully renovated two-bedroom flat in the heart of Kensington. Features open-plan living, modern kitchen with integrated appliances, and a private balcony overlooking the communal gardens. Walking distance to High Street Kensington tube.',
     285000, 'flat', 2, 1, '14 Kensington Court', 'London', 'W8 5DL',
     51.5005, -0.1876, 'available', true,
     '2-Bed Flat to Let in Kensington, London W8',
     'Stylish 2-bedroom flat in Kensington with balcony and modern finishes. Available now.'),

    -- 2. Bristol
    (v_landlord_id,
     'Charming 3-Bed Victorian Terrace',
     'charming-3-bed-victorian-terrace-bristol',
     '### The Architect\n\nBrinkworth is a London-based architecture and design studio known for innovative, socially engaged, and material-led projects. The practice works across architecture, interiors, exhibitions, and masterplanning. Brinkworth is especially recognised for adaptive reuse, sustainable design, and community-focused work, including cultural spaces, housing, and retail environments.\n\n### The House\n\nNetherhall Gardens was commissioned in 2010. Located within a sensitive north London conservation site, its respectful design was the result of negotiation with a restrictive local authority. Suburban clichés are reinterpreted: black brick, a cut-back pitched roof, and a flush bay window both nod and deviate from the surrounding buildings. The project was highly commended by the Architectural Review in 2017.\n\n### The Tour\n\nLarge electric gates open to reveal a large flagstone-laid driveway with space for one car. In front lies the house, a triumph of glass and brickwork, arranged in a striking stepped configuration.\n\nEntry is via a large sapele door to a double-height hallway, an airy space that sets the tone for the dynamic volumes that unfold beyond. Ahead is the open-plan core of the house, a bright, airy living room with a crisp bespoke kitchen and Gaggenau appliances. There is room for a large dining table in front, as well as a relaxed seating area. A generous area at the front of the plan is currently used as a study. Large-format glazing opens to the landscaped garden beyond.\n\nA stairwell to one side is open to the glass ceiling above, dramatically blending the exterior brickwork with the interior. Below is another large living area, a versatile space that can be easily delineated with furniture. There is a snug-like nook at the far end, and a brick fireplace with an open fire provides a focal point in the centre of the room. Here, dark oak floors are paired with simple walls, and light is brought in by the expansive glass panels above. There is access to a modest courtyard, which in turn has stairs to the garden; these have been designed to rise, allowing for concealed storage. At the back of this level is a spacious utility room and a shower room.\n\nThe principal bedroom is a remarkable space; set on the second floor, it occupies the entire storey. It has lime-washed oak floors, a private roof terrace, an adjoining WC, a freestanding bathtub and a walk-in shower. Picture windows face out to the surrounding greenery, and a wall of brown-framed glazing ushers in plenty of light.\n\nOn the floor below are three additional bedrooms, all with carefully crafted joinery and ample storage space. The largest unit has an en suite shower room and a terrace. There is also a separate pristine bathroom.\n\n### Outdoor Space\n\nGardens bookend the house, offering plenty of space for outdoor relaxation. In the rear, the garden has a tiered design with the rear mostly laid to lawn. Majestic silver birch trees stand tall within well-stocked borders.\n\nThere are also private terraces from the two largest bedrooms, on the first and top floors respectively.\n\nThere is space for one car behind the security gates at the front of the house.\n\n### The Area\n\nNetherhall Gardens is a wide, tree-lined street in Hampstead. There are plenty of independent shops, restaurants and cultural hubs nearby, including the Hampstead Butcher, Providore, and an Everyman cinema. Hampstead is also home to some wonderful pubs, including The Holly Bush, The Flask and the famous Spaniards Inn on the Heath. There are some fantastic cultural sites nearby, including Fenton House (National Trust) and Kenwood House.\n\nSwiss Cottage Farmers'' Market (held every Wednesday) and the Hampstead Theatre are both around a 10-minute walk away from the house. The Basil Spence-designed Swiss Cottage Library, Swiss Cottage Leisure Centre and swimming pool, and the Odeon cinema and IMAX are approximately a 12-minute walk away. The shops, delis and cafes of England''s Lane, including boulangerie and patisserie Sable d''Or, are close by. There is also a Waitrose on Finchley Road.\n\nThe green spaces of Hampstead Heath and its famous swimming ponds and Primrose Hill Park are both around a 20-minute walk away, with Regent''s Park a little further to the south. On the fringes of Hampstead Heath is an outpost of Gail''s bakery and the infamous La Creperie de Hampstead.\n\nMany of north London''s best state and independent schools are nearby, including St Christopher''s, Hampstead Hill, North Bridge House, South Hampstead High School and University College School.\n\nNetherhall Gardens is well placed for transport. Finchley Road station (Jubilee, Metropolitan & Northern lines) and Finchley Road & Frognal station (Mildmay line) are both a short walk from the house. In the other direction, Hampstead Underground station (Northern line) is a nine-minute walk away.',
     175000, 'house', 3, 2, '28 Royal York Crescent', 'Bristol', 'BS8 4JZ',
     51.4545, -2.6215, 'available', true,
     '3-Bed Victorian Terrace in Clifton, Bristol',
     'Stunning Victorian terrace with period features and garden in Clifton, Bristol.'),

    -- 3. Salford
    (v_landlord_id,
     'Modern Studio Apartment in MediaCityUK',
     'modern-studio-mediacityuk-salford',
     'A contemporary studio apartment in the vibrant MediaCityUK development. Floor-to-ceiling windows with waterfront views, fitted kitchen, and access to residents'' gym and concierge. Ideal for young professionals.',
     95000, 'studio', 0, 1, 'The Quays, MediaCityUK', 'Salford', 'M50 3AH',
     53.4727, -2.2984, 'available', true,
     'Studio Apartment at MediaCityUK, Salford',
     'Waterfront studio with gym access at MediaCityUK. Perfect for professionals.'),

    -- 4. Harrogate
    (v_landlord_id,
     'Spacious 4-Bed Detached in Harrogate',
     'spacious-4-bed-detached-harrogate',
     'An impressive four-bedroom detached family home on a quiet cul-de-sac in Harrogate. Double garage, large south-facing garden, modern kitchen-diner, and separate utility room. Excellent catchment for local grammar schools.',
     220000, 'house', 4, 3, '7 The Oval', 'Harrogate', 'HG2 9BA',
     53.9921, -1.5378, 'available', true,
     '4-Bed Detached House in Harrogate',
     'Large family home with garage and garden in sought-after Harrogate location.'),

    -- 5. Canary Wharf
    (v_landlord_id,
     'Luxury 1-Bed in Canary Wharf Tower',
     'luxury-1-bed-canary-wharf',
     'A premium one-bedroom apartment on the 22nd floor with panoramic views of the Thames and Docklands. 24-hour concierge, swimming pool, and private cinema room. Moments from Canary Wharf station.',
     240000, 'flat', 1, 1, 'Pan Peninsula, South Quay', 'London', 'E14 9HN',
     51.5013, -0.0158, 'let', true,
     '1-Bed Luxury Flat in Canary Wharf, London E14',
     'Premium 22nd-floor apartment with Thames views and pool in Canary Wharf.'),

    -- 6. Cotswolds
    (v_landlord_id,
     'Cosy 2-Bed Cottage in the Cotswolds',
     'cosy-2-bed-cottage-cotswolds',
     'A picture-perfect two-bedroom Cotswold stone cottage with exposed beams, inglenook fireplace, and a cottage garden. Located in the village of Bourton-on-the-Water. Unfurnished, pets considered.',
     135000, 'house', 2, 1, '3 Mill Lane', 'Bourton-on-the-Water', 'GL54 2BY',
     51.8862, -1.7554, 'available', true,
     '2-Bed Cotswold Cottage in Bourton-on-the-Water',
     'Charming stone cottage with beams and garden in the heart of the Cotswolds.'),

    -- 7. Manchester Penthouse
    (v_landlord_id,
     'Penthouse Suite with Rooftop Terrace',
     'penthouse-rooftop-terrace-manchester',
     'A stunning three-bedroom penthouse at the top of Deansgate Square, Manchester. Private rooftop terrace, triple-aspect views, bespoke kitchen, and smart home automation throughout. Two secure parking spaces included.',
     350000, 'flat', 3, 2, 'Deansgate Square, Owen Street', 'Manchester', 'M15 4FY',
     53.4747, -2.2477, 'let', true,
     '3-Bed Penthouse in Deansgate Square, Manchester',
     'Spectacular penthouse with rooftop terrace and panoramic Manchester views.'),

    -- 8. Edinburgh
    (v_landlord_id,
     'Refurbished 1-Bed in Edinburgh New Town',
     'refurbished-1-bed-edinburgh-new-town',
     'A freshly refurbished one-bedroom flat in a Georgian townhouse on a classic Edinburgh crescent. High ceilings, sash windows, modern bathroom, and shared garden access. Five minutes to Princes Street.',
     125000, 'flat', 1, 1, '18 Royal Circus', 'Edinburgh', 'EH3 6SS',
     55.9579, -3.2005, 'available', true,
     '1-Bed Flat in Edinburgh New Town',
     'Georgian flat with high ceilings and garden in Edinburgh''s New Town.'),

    -- 9. Cardiff
    (v_landlord_id,
     'Waterfront 2-Bed in Cardiff Bay',
     'waterfront-2-bed-cardiff-bay',
     'A modern two-bedroom apartment overlooking Cardiff Bay. Open-plan living with Juliet balcony, allocated parking, and access to communal roof garden. Walking distance to the Wales Millennium Centre and Mermaid Quay.',
     115000, 'flat', 2, 1, 'Prospect Place, Cardiff Bay', 'Cardiff', 'CF11 0JD',
     51.4637, -3.1631, 'available', true,
     '2-Bed Waterfront Flat in Cardiff Bay',
     'Bay-facing 2-bed apartment with parking and roof garden in Cardiff Bay.'),

    -- 10. Solihull
    (v_landlord_id,
     '3-Bed Semi-Detached in Solihull',
     '3-bed-semi-detached-solihull',
     'A well-maintained three-bedroom semi-detached home in a popular Solihull neighbourhood. Driveway parking, conservatory, recently fitted kitchen, and close to Solihull town centre and John Lewis.',
     145000, 'house', 3, 1, '52 Warwick Road', 'Solihull', 'B91 3DA',
     52.4120, -1.7780, 'available', true,
     '3-Bed Semi in Solihull, West Midlands',
     'Family semi-detached with conservatory and driveway in Solihull.'),

    -- 11. Shoreditch
    (v_landlord_id,
     'Converted Loft Studio in Shoreditch',
     'converted-loft-studio-shoreditch',
     'An industrial-chic loft conversion in a former warehouse on Curtain Road, Shoreditch. Exposed brickwork, double-height ceilings, mezzanine sleeping area, and rain shower. Bills included in rent.',
     195000, 'studio', 0, 1, '44 Curtain Road', 'London', 'EC2A 3NH',
     51.5244, -0.0816, 'available', true,
     'Loft Studio in Shoreditch, London EC2',
     'Unique warehouse loft conversion with exposed brick in Shoreditch. Bills included.'),

    -- 12. Brighton
    (v_landlord_id,
     'Seaside 3-Bed Townhouse in Brighton',
     'seaside-3-bed-townhouse-brighton',
     'A three-bedroom townhouse steps from Brighton seafront. Three floors of living space, roof terrace with sea views, modern throughout. Easy access to Brighton station for London commuters.',
     210000, 'house', 3, 2, '16 Marine Parade', 'Brighton', 'BN2 1TL',
     50.8194, -0.1271, 'let', true,
     '3-Bed Townhouse on Brighton Seafront',
     'Seaside townhouse with roof terrace and sea views on Brighton seafront.'),

    -- 13. Nottingham
    (v_landlord_id,
     '2-Bed Garden Flat in Nottingham',
     '2-bed-garden-flat-nottingham',
     'A ground-floor two-bedroom flat in the Lace Market district of Nottingham with a private patio garden. Fully furnished, modern bathroom, and open-plan kitchen-living area. Close to tram stops and city centre.',
     98000, 'flat', 2, 1, '8 Stoney Street', 'Nottingham', 'NG1 1LH',
     52.9534, -1.1446, 'available', true,
     '2-Bed Garden Flat in Lace Market, Nottingham',
     'Furnished ground-floor flat with private garden in Nottingham''s Lace Market.'),

    -- 14. Virginia Water
    (v_landlord_id,
     'Executive 4-Bed in Virginia Water',
     'executive-4-bed-virginia-water',
     'A prestigious four-bedroom detached property on the Wentworth Estate. Gated entrance, double garage, landscaped grounds, and a bespoke kitchen with Miele appliances. Close to Virginia Water lake and station.',
     450000, 'house', 4, 3, 'Wentworth Drive', 'Virginia Water', 'GU25 4NY',
     51.4012, -0.5805, 'available', true,
     '4-Bed Executive Home in Virginia Water, Surrey',
     'Luxury detached home on the Wentworth Estate with gated entrance and double garage.'),

    -- 15. Glasgow
    (v_landlord_id,
     '1-Bed Riverside Flat in Glasgow',
     '1-bed-riverside-flat-glasgow',
     'A sleek one-bedroom apartment on the banks of the River Clyde in Glasgow''s Finnieston. Floor-to-ceiling glazing, integrated kitchen, and views towards the SEC and Hydro. Furnished to a high standard.',
     98000, 'flat', 1, 1, 'Lancefield Quay', 'Glasgow', 'G3 8JF',
     55.8587, -4.2828, 'available', true,
     '1-Bed Riverside Flat in Finnieston, Glasgow',
     'Contemporary riverside flat with Clyde views in Glasgow''s Finnieston.'),

    -- 16. Bath
    (v_landlord_id,
     'Period 5-Bed in Bath''s Royal Crescent',
     'period-5-bed-bath-royal-crescent',
     'An exceptional five-bedroom maisonette across two floors of an iconic Grade I listed building on the Royal Crescent. Grand proportions, working fireplaces, and views over Royal Victoria Park. A rare opportunity.',
     550000, 'house', 5, 3, 'Royal Crescent', 'Bath', 'BA1 2LR',
     51.3872, -2.3686, 'let', true,
     '5-Bed on the Royal Crescent, Bath',
     'Magnificent Grade I listed maisonette on Bath''s Royal Crescent with park views.'),

    -- 17. Cambridge
    (v_landlord_id,
     '2-Bed New Build in Cambridge',
     '2-bed-new-build-cambridge',
     'A brand-new two-bedroom apartment in the Eddington development, northwest Cambridge. A-rated energy efficiency, underfloor heating, private terrace, and allocated cycle storage. 10 minutes to the city centre by bike.',
     165000, 'flat', 2, 2, 'Eddington Avenue', 'Cambridge', 'CB3 1SE',
     52.2173, 0.0913, 'available', true,
     '2-Bed New Build Flat in Eddington, Cambridge',
     'Energy-efficient new-build apartment with terrace in northwest Cambridge.'),

    -- 18. Peak District
    (v_landlord_id,
     'Converted Barn in the Peak District',
     'converted-barn-peak-district',
     'A stunning three-bedroom barn conversion on the edge of the Peak District National Park. Vaulted ceilings with oak trusses, underfloor heating, log burner, and panoramic countryside views. Private driveway and paddock.',
     185000, 'house', 3, 2, 'Hartington Lane', 'Bakewell', 'DE45 1NR',
     53.2131, -1.6763, 'available', true,
     '3-Bed Barn Conversion near Bakewell, Peak District',
     'Beautiful barn conversion with countryside views on the edge of the Peak District.');

  -- Step 4: Insert photos (one per property using public Unsplash URLs)
  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 'Modern flat interior with open-plan living room', 0
  from public.properties where slug = 'elegant-2-bed-flat-kensington';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80', 'Victorian terrace house exterior', 0
  from public.properties where slug = 'charming-3-bed-victorian-terrace-bristol';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', 'Modern studio apartment with large windows', 0
  from public.properties where slug = 'modern-studio-mediacityuk-salford';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', 'Detached family home with garden', 0
  from public.properties where slug = 'spacious-4-bed-detached-harrogate';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 'Luxury apartment with city skyline view', 0
  from public.properties where slug = 'luxury-1-bed-canary-wharf';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80', 'Stone cottage with garden', 0
  from public.properties where slug = 'cosy-2-bed-cottage-cotswolds';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', 'Penthouse living room with panoramic windows', 0
  from public.properties where slug = 'penthouse-rooftop-terrace-manchester';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', 'Bright apartment interior with high ceilings', 0
  from public.properties where slug = 'refurbished-1-bed-edinburgh-new-town';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 'Modern apartment building near waterfront', 0
  from public.properties where slug = 'waterfront-2-bed-cardiff-bay';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', 'Semi-detached house with driveway', 0
  from public.properties where slug = '3-bed-semi-detached-solihull';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 'Industrial loft space with exposed brick', 0
  from public.properties where slug = 'converted-loft-studio-shoreditch';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80', 'Townhouse exterior near seafront', 0
  from public.properties where slug = 'seaside-3-bed-townhouse-brighton';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', 'Ground floor flat with patio garden', 0
  from public.properties where slug = '2-bed-garden-flat-nottingham';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', 'Luxury detached home with landscaped garden', 0
  from public.properties where slug = 'executive-4-bed-virginia-water';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', 'Modern apartment with river views', 0
  from public.properties where slug = '1-bed-riverside-flat-glasgow';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80', 'Georgian architecture with ornate interior', 0
  from public.properties where slug = 'period-5-bed-bath-royal-crescent';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', 'New build apartment exterior', 0
  from public.properties where slug = '2-bed-new-build-cambridge';

  insert into public.property_photos (property_id, storage_path, alt_text, sort_order)
  select id, 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80', 'Converted stone barn with countryside views', 0
  from public.properties where slug = 'converted-barn-peak-district';

end $$;
