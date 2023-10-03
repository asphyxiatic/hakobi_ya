import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEntrances1696338625770 implements MigrationInterface {
    name = 'CreateEntrances1696338625770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "entrances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "number_entrance" integer NOT NULL, "completed" boolean NOT NULL, "house_id" uuid NOT NULL, CONSTRAINT "PK_42084a4198f5ed4c46257702e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "houses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "house_name" character varying NOT NULL, "address_id" uuid NOT NULL, CONSTRAINT "PK_ee6cacb502a4b8590005eb3dc8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "owner_id" uuid NOT NULL, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('superadmin', 'admin', 'regular')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "entrances" ADD CONSTRAINT "FK_8364b47d35d7b4646e909b300af" FOREIGN KEY ("house_id") REFERENCES "houses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "houses" ADD CONSTRAINT "FK_1fe486ff3fd650dae11345a6bba" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_3096609feae3c6b597f8b839c28" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_3096609feae3c6b597f8b839c28"`);
        await queryRunner.query(`ALTER TABLE "houses" DROP CONSTRAINT "FK_1fe486ff3fd650dae11345a6bba"`);
        await queryRunner.query(`ALTER TABLE "entrances" DROP CONSTRAINT "FK_8364b47d35d7b4646e909b300af"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`DROP TABLE "houses"`);
        await queryRunner.query(`DROP TABLE "entrances"`);
    }

}
