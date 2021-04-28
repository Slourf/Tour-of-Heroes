DROP TABLE IF EXISTS heroes CASCADE;

CREATE TABLE heroes
(
   id           serial,
   name         varchar(40)   NOT NULL,
   description  text,
   image        varchar(64),
   logo         varchar(64)
);

-- Column id is associated with sequence public.heroes_id_seq

ALTER TABLE heroes
   ADD CONSTRAINT heroes_pkey
   PRIMARY KEY (id);

ALTER TABLE heroes
  ADD CONSTRAINT fk_image FOREIGN KEY (image)
  REFERENCES heroes_image (image_path) 
  ON UPDATE CASCADE
  ON DELETE NO ACTION;

ALTER TABLE heroes
  ADD CONSTRAINT fk_logo FOREIGN KEY (logo)
  REFERENCES heroes_logo (logo_path) 
  ON UPDATE CASCADE
  ON DELETE NO ACTION;

DROP TABLE IF EXISTS heroes_image CASCADE;

CREATE TABLE heroes_image
(
   id            serial,
   fieldname     varchar(64),
   originalname  varchar(64),
   encoding      varchar(64),
   mimetype      varchar(64),
   destination   varchar(64),
   filename      varchar(64),
   image_path    varchar(64),
   size          integer,
   data          bytea
);

-- Column id is associated with sequence public.heroes_image_id_seq

ALTER TABLE heroes_image
   ADD CONSTRAINT heroes_image_pkey
   PRIMARY KEY (id);

ALTER TABLE heroes_image
   ADD CONSTRAINT heroes_image_image_path_key UNIQUE (image_path);

DROP TABLE IF EXISTS heroes_logo CASCADE;

CREATE TABLE heroes_logo
(
   id            serial,
   fieldname     varchar(64),
   originalname  varchar(64),
   encoding      varchar(64),
   mimetype      varchar(64),
   destination   varchar(64),
   filename      varchar(64),
   logo_path     varchar(64),
   size          integer,
   data          bytea
);

-- Column id is associated with sequence public.heroes_logo_id_seq

ALTER TABLE heroes_logo
   ADD CONSTRAINT heroes_logo_pkey
   PRIMARY KEY (id);

ALTER TABLE heroes_logo
   ADD CONSTRAINT heroes_logo_logo_path_key UNIQUE (logo_path);

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users
(
   id           serial,
   username     varchar(64)   NOT NULL,
   password     varchar(64),
);
