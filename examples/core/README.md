# Nest Base - Core Service
![AIT](readme/logo_color.svg)



## Table of Contents

- [Nest Base - Core Service](#nest-base---core-service)
  - [Table of Contents](#table-of-contents)
  - [Document History](#document-history)
  - [Introduction](#introduction)
    - [Project Overview](#project-overview)
    - [Seeder](#seeder)
      - [Super Admin](#super-admin)
      - [Module Permission](#module-permission)
    - [Dependencies 3rd Party](#dependencies-3rd-party)
  - [Architecture \& Design](#architecture--design)
    - [System Architecture](#system-architecture)
    - [Design Pattern](#design-pattern)
    - [Entity Relation](#entity-relation)
  - [Technical Specification](#technical-specification)
    - [Tech Stack](#tech-stack)
    - [Libraries](#libraries)
    - [Third-Party](#third-party)
  - [Technologies Used](#technologies-used)
  - [Dependent Service](#dependent-service)
  - [Setup](#setup)
    - [.env file reference](#env-file-reference)
    - [How to Run as Single Service](#how-to-run-as-single-service)
    - [How to Run as Micro Service in Local environment (nginx)](#how-to-run-as-micro-service-in-local-environment-nginx)


## Document History 
| Author          | Date          | Version | Summary of Changes   |
|-----------------|---------------|---------|-----------------------|
| Nie Ridwan   | 25 Jan 2023  | 1.0.0   | Initial version      |

## Introduction

### Project Overview
  **Deskripsi**: Layanan ini adalah konsep untuk mencoba fungsionalitas semua package yang ada di monorepo ini. dalam hal komunikasi antar service, service ini berperan sebagai producer/broadcaster.



### Seeder
Seeder ini berguna untuk menambahkan data tertentu dan tidak memiliki API Create. File **Seeder** ini jika di tambahkan datanya maka data di **database** akan otomatis tertambah , untuk update dan mengurangi nya perlu manual lewat **database** secara manual.
#### Super Admin
  - Path : [src/users/seeders/superadmins.data.ts](src/users/seeders/superadmins.data.ts)
  - Data ini digunakan oleh aplikasi untuk init user **Super Admin** 

#### Module Permission
  - Path : [src/user-role/eeders/module-permissions.data.ts](src/user-role/eeders/module-permissions.data.ts)
  - Data ini digunakan untuk menyimpan data module permission yang nantinya akan di gunakan dalam membuat permission.


### Dependencies 3rd Party
- none

## Architecture & Design
### System Architecture
<img src="readme/architecture_admin_service.png" alt="Architecture Admins Service" width="500" />

### Design Pattern
<img src="readme/design_pattern.svg" alt="Design Pattern" width="500" />

### Entity Relation
![ERD](readme/erd.png)

## Technical Specification	
### Tech Stack
- Framework: NestJS v9.4.0
- Database: Postgres, Redis, MonggoDB

### Libraries
- @aws-sdk/client-s3 (3.353.0+): S3 file service
- @aws-sdk/s3-request-presigner (3.353.0+): S3 file service
- @google-cloud/storage (6.12.0+): Google cloud file storage service
- @nestjs/axios (2.0.0+): external API request call
- @nestjs/bull (10.0.1+): queue/scheduler
- @nestjs/jwt (10.0.3+): parse/validate jwt
- @nestjs/typeorm (9.0.1+): Database ORM access
- moment: date/time formatter/parser
- @pt-akar-inti-teknologi/nest-notification: email/sms service

### Third-Party
- Storage: Firebase / AWS S3
- Email Service

## Technologies Used

- NestJS 9
- Nodejs 18.12.1-alpine
- PostgreSQL
- MonggoDB
- Redis
- JSON Web Token for auth

## Dependent Service
- None

## Setup

### .env file reference
- PROJECT_NAME: nama project yang akan dipakai untuk response code. format PROJECT_NAME-SERVICE_NAME-CODE
- SERVICE_NAME: penamaan service yang akan dipakai untuk response code. format PROJECT_NAME-SERVICE_NAME-CODE
- HTTP_PORT: port internal network yang dipakai untuk mengakses service.
- AUTH_JWTSECRETKEY: secret key untuk validate JWT. note: harus sama untuk semua microservice dalam 1 project
- AUTH_JWTEXPIRATIONTIME: kapan access token expired
- AUTH_REFRESHJWTEXPIRATIONTIME: kapan refresh token expired
- DB*: setting db, sesuai namanya. menggunakan postgresql connection
- MONGGODB*: setting monggodb.
- APP_LANGUAGE: language default dari microservice, akan dipakai untuk translasi error message
- STORAGE_DRIVER: pemilihan driver storage system (file upload) yang akan dipakai. option: s3/local/firebase
- STORAGE_S3_*: setting koneksi jika pakai STORAGE_DRIVER s3
- STORAGE_LOCAL_*: setting koneksi jika pakai STORAGE_DRIVER local
- STORAGE_FIREBASE_*: setting koneksi jika pakai STORAGE_DRIVER firebase
- REDIS_*: setting koneksi ke redis, wajib

### How to Run as Single Service

- Copy `.env.example` to `.env` and fill in the parameters
- `yarn install`
- `yarn start:dev`

### How to Run as Micro Service in Local environment (nginx)

- Install postgresql
- Install monggodb
- Install redis
- Install nginx, setup server seperti contoh berikut, atau bisa disesuaikan, setiap location diarahkan ke masing masing service
```conf
server {
    listen       80;
    server_name  localhost;

    add_header Access-Control-Allow-Origin *;

    location /cms {
        proxy_pass http://localhost:9099/cms;
    }

    location /api/v1/core {
        proxy_pass http://localhost:9001/api/v1/core;
    }
    location /api/v1/internal/core {
        proxy_pass http://localhost:9001/api/v1/internal/core;
        add_header Access-Control-Allow-Origin *;
    }

    location /api/v1/listener {
        proxy_pass http://localhost:9002/api/v1/listener;
    }
    location /api/v1/internal/listener {
        proxy_pass http://localhost:9002/api/v1/internal/listener;
    }

    location / {
        root   html;
        index  index.html index.htm;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }

}
```
- Nyalakan postgresql, monggodb, nginx, redis
- Nyalakan service yang dibutuhkan: loyalties (service ini), admin (untuk login), lain lainnya (opsional)



