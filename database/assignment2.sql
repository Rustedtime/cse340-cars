-- Add Tony Stark
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Change Tony Stark to Admin
UPDATE public.account
SET account_type = 'Admin'::account_type
WHERE account_email = 'tony@starkent.com';

-- Delete Tony Stark
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- Modify GM Hummer description
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

-- Select Sports cars using INNER JOIN
SELECT inv_make, inv_model FROM public.inventory
INNER JOIN public.classification
ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';

-- Add /vehicles to image file path
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles');

-- Add /vehicles to thumbnail file path
UPDATE public.inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');