INSERT INTO account VALUES (0, 'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE account SET account_type = 'Admin' 
WHERE account_id = (SELECT account_id FROM account WHERE account_firstname = 'Tony' AND account_lastname = 'Stark' AND account_email = 'tony@starkent.com');

DELETE FROM account WHERE account_id = 0;

UPDATE inventory SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior');

SELECT inv_make, inv_model FROM inventory AS i JOIN classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = 2;

UPDATE inventory AS i SET inv_image = REPLACE(inv_image, 'images/','images/vehicles/'), inv_thumbnail = REPLACE(inv_thumbnail, 'images/','images/vehicles/');