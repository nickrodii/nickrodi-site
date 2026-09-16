---
title: Event Finder
description: Event platform built with ASP.NET and C# that supports authentication, role-based access, and registration.
eyebrow: Page
backHref: /#projects
showRepositoryReadmeNotice: true
---

## Project Overview

- ASP.NET Web Forms event discovery and event registration application.
- Built as a 3-person team project with separate public, member, and admin/staff experiences.
- Designed around XML-backed persistence, service-based event retrieval, and role-based access control.
- Uses C#, ASP.NET Web Forms, a WCF `.svc` service, Bootstrap, and Newtonsoft.Json.

## Core Features

- Public landing page that introduces the application and its components.
- Shared master page layout with site-wide navigation and authentication controls.
- Sign up and login flows built directly into Bootstrap modal dialogs.
- Cookie-based authentication for remembering logged-in users across pages.
- Role-aware UI that shows admin-only controls when a user has elevated access.
- Sign out flow that clears authentication cookies and resets the UI.

## Authentication and Security

- Password hashing implemented in a separate reusable C# class library (`AuthSecurityLib`).
- SHA-256 hashing used before storing newly created passwords.
- Login CAPTCHA using server-generated math challenges stored in session state.
- TryIt page for testing the password hashing DLL with CAPTCHA protection.
- Automatic compatibility handling for legacy plaintext passwords.
- Automatic migration from plaintext passwords to hashed passwords after successful login.

## Event Features

- Browse all available events from the member page.
- Search events by keyword across event descriptions and locations.
- View event metadata including ID, description, date/time, and location.
- Register and deregister for events directly from the event list.
- Show per-user registration state so the UI can switch between Register and Deregister actions.

## Admin / Staff Features

- Admin-only event manager page.
- Create new events with description, location, date, and time fields.
- Server-side validation for required event fields.
- Automatic generation of unique event IDs.
- View all events in a management table.
- Delete events from the system.
- Cleanup of related registration records when an event is deleted.

## Service and Data Layer

- WCF service (`EventHandler.svc`) used to expose event-related operations.
- Service methods to return all events, search events, fetch a user’s registered events, and update registrations.
- JSON responses returned from the service layer for easy client consumption.
- XML-based storage for users and events in `App_Data/database.xml`.
- Separate XML registration log in `App_Data/EventRegistrations.xml`.
- Dual-update registration flow that keeps both XML data sources synchronized.

## State Management and App Behavior

- Session-based CAPTCHA answer storage.
- Cookie-based storage for username and admin status.
- Application-level statistics tracked through `Global.asax`.
- Site runtime display in the footer.
- Active session count tracking.
- Total registration/deregistration action count tracking.

## UI / UX Details

- Bootstrap-based layout and styling.
- Modal-based login and account creation flow.
- GridView-based event browsing and admin event management.
- Inline status and error messaging for search, login, registration, and event actions.
- TryIt page for demonstrating reusable local components.

## Tech Stack

- C#
- ASP.NET Web Forms
- WCF (`.svc`) services
- XML data storage
- Newtonsoft.Json
- Bootstrap 5
- Cookies, Session State, and Application State

## Team Context

- Developed as a 3-person team project.
- Combined web UI, authentication, local reusable components, XML persistence, and service-based event management into one application.
