ALTER TABLE "userGroups" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "userGroups" ADD COLUMN "deletedAt" timestamp;