CREATE TABLE `users` (
	`user_id` INT NOT NULL AUTO_INCREMENT,
    `user_age` INT DEFAULT '0',
    `user_status` INT DEFAULT '0',
    `user_name` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL,
    `user_email` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL,
    `user_address` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL,
    -- KEY INDEX
    PRIMARY KEY (`user_id`),
    KEY `idx_email_age_name` (`user_email`, `user_age`, `user_name`),
    KEY `idx_status` (`user_status`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_bin;

insert into users(user_id, user_age, user_status, user_name, user_email, user_address) values 
(1, 24, 1, 'Michael', 'michael@gmail.com', 'Ha Noi');

explain select * from users where user_status = '1';
select concat('1' + 1);

select concat('1', 1);

explain select * from users where user_email like '%michael';