CREATE TYPE "public"."payment_status_type" AS ENUM('pending', 'success', 'failed');--> statement-breakpoint
CREATE TABLE "bank_acquiring" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bankcard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"bank_acquiring_id" uuid NOT NULL,
	"currency_id" uuid NOT NULL,
	"payment_token" uuid,
	"public_cart_info" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channel_type_cost" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"channel_type_id" uuid NOT NULL,
	"currency_id" uuid NOT NULL,
	"cost" numeric(19, 4) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channel_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_channel_slot" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"company_channel_id" uuid NOT NULL,
	"channel_type_id" uuid NOT NULL,
	"exp_at" timestamp NOT NULL,
	"qty_months" integer NOT NULL,
	"autopayment" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_inn" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"inn" varchar(255) NOT NULL,
	"kpp" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_rate_feature" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_rate_id" uuid NOT NULL,
	"rate_feature_id" uuid NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_rate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"rate_id" uuid NOT NULL,
	"next_rate_id" uuid,
	"exp_at" timestamp NOT NULL,
	"qty_months" integer NOT NULL,
	"autopayment" boolean NOT NULL,
	"changed_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_waba_wallet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"value" numeric(19, 4) NOT NULL,
	"currency_id" uuid NOT NULL,
	"min_limit" numeric(19, 4) NOT NULL,
	"autopayment" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "currency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(3) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_detail_channel_slot" (
	"payment_id" uuid NOT NULL,
	"company_channel_slot_id" uuid NOT NULL,
	"currency_id" uuid NOT NULL,
	"qty_months" integer NOT NULL,
	"cost" numeric(19, 4) NOT NULL,
	"discount_cost" numeric(19, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_detail_rate_feature" (
	"payment_id" uuid NOT NULL,
	"company_rate_feature_id" uuid NOT NULL,
	"currency_id" uuid NOT NULL,
	"qty_months" integer NOT NULL,
	"cost" numeric(19, 4) NOT NULL,
	"discount_cost" numeric(19, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_detail_rate" (
	"payment_id" uuid NOT NULL,
	"company_rate_id" uuid NOT NULL,
	"currency_id" uuid NOT NULL,
	"qty_months" integer NOT NULL,
	"cost" numeric(19, 4) NOT NULL,
	"discount_cost" numeric(19, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_detail_waba_wallet" (
	"payment_id" uuid NOT NULL,
	"company_waba_wallet_id" uuid NOT NULL,
	"currency_id" uuid NOT NULL,
	"cost" numeric(19, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"status" "payment_status_type" NOT NULL,
	"breadcrumbs" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_via_bankcard" (
	"bankcard_id" uuid NOT NULL,
	"payment_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_via_inn" (
	"company_inn_id" uuid NOT NULL,
	"payment_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"currency_id" uuid NOT NULL,
	"final_cost" numeric(19, 4) NOT NULL,
	"final_discount_cost" numeric(19, 4) NOT NULL,
	"sys_payment" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_cost" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"currency_id" uuid NOT NULL,
	"rate_id" uuid NOT NULL,
	"cost" numeric(19, 4) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_feature_cost" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"currency_id" uuid NOT NULL,
	"rate_feature_id" uuid NOT NULL,
	"cost_per_piece" numeric(19, 4),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_feature" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rate_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"product_id" uuid NOT NULL,
	"hidden" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bankcard" ADD CONSTRAINT "bankcard_bank_acquiring_id_bank_acquiring_id_fk" FOREIGN KEY ("bank_acquiring_id") REFERENCES "public"."bank_acquiring"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bankcard" ADD CONSTRAINT "bankcard_currency_id_currency_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel_type_cost" ADD CONSTRAINT "channel_type_cost_channel_type_id_channel_type_id_fk" FOREIGN KEY ("channel_type_id") REFERENCES "public"."channel_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel_type_cost" ADD CONSTRAINT "channel_type_cost_currency_id_currency_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_channel_slot" ADD CONSTRAINT "company_channel_slot_channel_type_id_channel_type_id_fk" FOREIGN KEY ("channel_type_id") REFERENCES "public"."channel_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_rate_feature" ADD CONSTRAINT "company_rate_feature_company_rate_id_company_rate_id_fk" FOREIGN KEY ("company_rate_id") REFERENCES "public"."company_rate"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_rate_feature" ADD CONSTRAINT "company_rate_feature_rate_feature_id_rate_feature_id_fk" FOREIGN KEY ("rate_feature_id") REFERENCES "public"."rate_feature"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_rate" ADD CONSTRAINT "company_rate_rate_id_rate_id_fk" FOREIGN KEY ("rate_id") REFERENCES "public"."rate"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_waba_wallet" ADD CONSTRAINT "company_waba_wallet_currency_id_currency_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_detail_channel_slot" ADD CONSTRAINT "pd_channel_slot_payment_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_detail_channel_slot" ADD CONSTRAINT "pd_channel_slot_company_fk" FOREIGN KEY ("company_channel_slot_id") REFERENCES "public"."company_channel_slot"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_detail_channel_slot" ADD CONSTRAINT "pd_channel_slot_currency_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_detail_rate_feature" ADD CONSTRAINT "pd_rate_feature_payment_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_detail_rate_feature" ADD CONSTRAINT "pd_rate_feature_company_fk" FOREIGN KEY ("company_rate_feature_id") REFERENCES "public"."company_rate_feature"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_detail_rate_feature" ADD CONSTRAINT "pd_rate_feature_currency_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_detail_rate" ADD CONSTRAINT "payment_detail_rate_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_detail_rate" ADD CONSTRAINT "payment_detail_rate_company_rate_id_company_rate_id_fk" FOREIGN KEY ("company_rate_id") REFERENCES "public"."company_rate"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_detail_rate" ADD CONSTRAINT "payment_detail_rate_currency_id_currency_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_detail_waba_wallet" ADD CONSTRAINT "pd_waba_wallet_payment_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_detail_waba_wallet" ADD CONSTRAINT "pd_waba_wallet_company_fk" FOREIGN KEY ("company_waba_wallet_id") REFERENCES "public"."company_waba_wallet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_detail_waba_wallet" ADD CONSTRAINT "pd_waba_wallet_currency_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_status" ADD CONSTRAINT "payment_status_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_via_bankcard" ADD CONSTRAINT "payment_via_bankcard_bankcard_id_bankcard_id_fk" FOREIGN KEY ("bankcard_id") REFERENCES "public"."bankcard"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_via_bankcard" ADD CONSTRAINT "payment_via_bankcard_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_via_inn" ADD CONSTRAINT "payment_via_inn_company_inn_id_company_inn_id_fk" FOREIGN KEY ("company_inn_id") REFERENCES "public"."company_inn"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_via_inn" ADD CONSTRAINT "payment_via_inn_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_currency_id_currency_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_cost" ADD CONSTRAINT "rate_cost_currency_id_currency_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_cost" ADD CONSTRAINT "rate_cost_rate_id_rate_id_fk" FOREIGN KEY ("rate_id") REFERENCES "public"."rate"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_feature_cost" ADD CONSTRAINT "rate_feature_cost_currency_id_currency_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_feature_cost" ADD CONSTRAINT "rate_feature_cost_rate_feature_id_rate_feature_id_fk" FOREIGN KEY ("rate_feature_id") REFERENCES "public"."rate_feature"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_feature" ADD CONSTRAINT "rate_feature_rate_id_rate_id_fk" FOREIGN KEY ("rate_id") REFERENCES "public"."rate"("id") ON DELETE no action ON UPDATE no action;