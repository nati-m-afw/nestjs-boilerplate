import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1727124355660 implements MigrationInterface {
    name = 'Migrations1727124355660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "data_lookups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "value" character varying NOT NULL, "description" character varying NOT NULL, "note" character varying NOT NULL DEFAULT '', "category" character varying NOT NULL, "index" integer NOT NULL, "isDefault" boolean NOT NULL, "isActive" boolean NOT NULL, "remark" character varying, CONSTRAINT "PK_0a77d268d2d6ef578259b96b93e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '5 minutes', "user" uuid, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN', 'DEV')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "password" character varying NOT NULL, "username" character varying(200) NOT NULL, "email" character varying(200) NOT NULL, "birthDate" date NOT NULL, "phone" character varying(18) NOT NULL, "role" "public"."users_role_enum" NOT NULL, "refreshToken" text, "state" uuid, "settings" uuid, CONSTRAINT "username" UNIQUE ("username"), CONSTRAINT "email" UNIQUE ("email"), CONSTRAINT "REL_9afded6b96a951ddbc0bc7f7a8" UNIQUE ("settings"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isEmailVerified" boolean NOT NULL DEFAULT false, "isPhoneVerified" boolean NOT NULL DEFAULT false, "receiveEmails" boolean NOT NULL DEFAULT true, "receiveSms" boolean NOT NULL DEFAULT true, "receivePushNotifications" boolean NOT NULL DEFAULT true, "user" uuid, CONSTRAINT "REL_0bf957e42204987f7f7c2ec053" UNIQUE ("user"), CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_d863a84e0f636c7224237aedffb" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_27ae2293c06e67afd9566717108" FOREIGN KEY ("state") REFERENCES "data_lookups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9afded6b96a951ddbc0bc7f7a8b" FOREIGN KEY ("settings") REFERENCES "user_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_0bf957e42204987f7f7c2ec053b" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_0bf957e42204987f7f7c2ec053b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9afded6b96a951ddbc0bc7f7a8b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_27ae2293c06e67afd9566717108"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_d863a84e0f636c7224237aedffb"`);
        await queryRunner.query(`DROP TABLE "user_settings"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TABLE "data_lookups"`);
    }

}
