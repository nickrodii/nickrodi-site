---
title: Q&A System
description: Question-and-answer platform built with Java, JavaFX, and SQL that supports account, role, and post management.
eyebrow: Page
backHref: /#projects
showRepositoryReadmeNotice: true
download:
  label: Download release
  href: /downloads/qa-system-release.zip
  fileName: qa-system-release.zip
---

## Project Overview

- JavaFX desktop application for managing academic Q&A, peer reviews, and instructor support workflows.
- Built by a 5-person team as a multi-role system with separate experiences for students, instructors, reviewers, staff, and admins.
- Designed around role-based permissions, persistent data storage, and user workflow management rather than just basic CRUD screens.
- Uses Java, JDBC, and an H2 database to store users, questions, answers, reviews, messages, and request history.

## Core Features

- First-run admin setup when the database is empty.
- Invitation-code account creation for new users.
- Username and password validation during account setup.
- User login with role-aware navigation.

## Q&A Features

- Create, update, and delete questions.
- Create, update, and delete answers.
- Mark answers as correct.
- Add clarifications to answers.
- Search questions by keyword.
- View answers directly alongside matching questions.

## Role-Based Functionality

- Students can manage their Q&A activity, request reviewer status, and manage trusted reviewers.
- Instructors can create admin requests, view closed requests, and reopen requests with updated descriptions.
- Reviewers can write, edit, and delete reviews for questions or answers.
- Reviewers can maintain a profile with experience/bio information and view feedback on their reviews.
- Staff can flag questions and answers, remove flags, and leave staff-only moderation notes.
- Admins can approve or deny reviewer requests, promote users to staff, generate invitation codes, and manage admin requests.

## Review and Trust System

- Reviewers can leave written reviews on questions and answers.
- Students can maintain a list of trusted reviewers with adjustable weighting.
- Students can search questions and view reviews only from their trusted reviewers.
- Students can leave feedback on reviews they receive.

## Request and Moderation Workflow

- Instructors can submit support requests for admins.
- Admins can close requests and attach action history to each request.
- Instructors can reopen closed requests while preserving links to the original request.
- Staff can review flagged content and document internal notes for moderation.

## Messaging and Data Features

- Private messaging between users.
- Read/unread message tracking.
- Persistent storage for users, Q&A content, reviews, trusted reviewers, moderation data, and request history.

## Testing and Quality

- Backend behavior is supported by JUnit tests.
- The test suite covers user registration, permissions, request workflows, moderation actions, reviewer request handling, and search behavior.
- The project includes around 30 test cases focused on verifying major user stories and role restrictions.

## Tech Stack

- Java
- JavaFX
- JDBC
- H2 Database
- JUnit 5

## Team Context

- Developed collaboratively by a 5-person team.
- Focused on combining UI, backend logic, database persistence, and workflow-based permissions into a single desktop application.
