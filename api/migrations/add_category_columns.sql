-- Pridėti image ir description stulpelius į categories lentelę
-- Paleiskite šią komandą MySQL

ALTER TABLE `categories` 
ADD COLUMN `description` TEXT NULL AFTER `slug`,
ADD COLUMN `image` VARCHAR(255) NULL AFTER `description`;
