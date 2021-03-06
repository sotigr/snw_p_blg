﻿CREATE TABLE account_proto(
id	int(6) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
nick	varchar(255) NOT NULL unique, 
pass	varchar(255) NOT NULL,
email	varchar(255) NOT NULL,
icon	varchar(255),
firstname	varchar(255) ,
lastname	varchar(255) ,
sec_clearence	int(2) ,
banned	int(1) ,
active	int(1) ,
creation_date	date , 
last_ip	varchar(255)  
);
CREATE TABLE locale_GR(
id	int(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
name	varchar(255) NOT NULL,
value	varchar(255) NOT NULL
);
CREATE TABLE locale_EN(
id	int(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
name	varchar(255) NOT NULL,
value	varchar(255) NOT NULL
);
CREATE TABLE image_proto(
id	int(6) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
physical_name	varchar(255) NOT NULL,
owner_id		int(6) NOT NULL
);
CREATE TABLE icon_proto(
id	int(6) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
physical_name	varchar(255) NOT NULL,
owner_id		int(6) NOT NULL
);