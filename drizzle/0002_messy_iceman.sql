CREATE TABLE `quote_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(100) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(320),
	`address` text NOT NULL,
	`serviceType` enum('in_person','non_contact') NOT NULL,
	`planId` varchar(32) NOT NULL,
	`message` text,
	`status` enum('pending','contacted','confirmed','canceled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quote_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `subscriptions`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `stripeCustomerId`;