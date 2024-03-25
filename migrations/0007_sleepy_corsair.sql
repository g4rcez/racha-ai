CREATE TABLE IF NOT EXISTS "secrets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" varchar(16) NOT NULL,
	"secret" text,
	"public" text,
	"createdBy" varchar(512) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"image" text,
	"name" varchar(256) NOT NULL,
	"password" varchar(256),
	"email" varchar(256) NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"secretId" uuid,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersFriends" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"message" varchar(256) DEFAULT '' NOT NULL,
	"status" varchar(16) NOT NULL,
	"ownerId" uuid NOT NULL,
	"invitedId" uuid NOT NULL,
	CONSTRAINT "usersFriends_ownerId_invitedId_unique" UNIQUE("ownerId","invitedId")
);
--> statement-breakpoint
DROP TABLE "groups";--> statement-breakpoint
DROP TABLE "userGroups";--> statement-breakpoint
DROP TABLE "user";--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_ownerId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_groupId_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_groupId_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_ownerId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_ownerId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_groupId_groups_id_fk";
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emailIndex" ON "users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orderItems" DROP COLUMN IF EXISTS "groupId";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "groupId";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN IF EXISTS "groupId";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_secretId_secrets_id_fk" FOREIGN KEY ("secretId") REFERENCES "secrets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersFriends" ADD CONSTRAINT "usersFriends_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersFriends" ADD CONSTRAINT "usersFriends_invitedId_users_id_fk" FOREIGN KEY ("invitedId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
