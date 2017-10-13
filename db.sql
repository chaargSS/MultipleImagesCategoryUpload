CREATE DATABASE category;
use category;
CREATE TABLE IF NOT EXISTS  `users` (
  `id` int(10) NOT NULL AUTO_INCREMENT ,  
   `name` varchar(250) NOT NULL ,
   `email` varchar(250) NOT NULL ,
   `password` varchar(250) NOT NULL ,
   `salt` varchar(10) NOT NULL ,
   PRIMARY KEY (`id`)
  )   DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

  CREATE TABLE IF NOT EXISTS  `item` (
  `id` int(10) NOT NULL AUTO_INCREMENT , 
    `Title` varchar(250) NOT NULL ,
   `name` varchar(250) NOT NULL ,
   `category` varchar(250) NOT NULL ,
   `images` varchar(250) NOT NULL , 
   PRIMARY KEY (`id`)
  )   DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

  