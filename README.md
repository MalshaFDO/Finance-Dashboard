# Finance Dashboard

A simple finance dashboard built with React, TypeScript, and Vite for tracking financial activity, exploring transactions, and understanding spending patterns.

## Overview

This project was designed around a lightweight dashboard experience with:

- a high-level financial summary
- transaction exploration with filtering and search
- role-based UI behavior on the frontend
- basic spending insights
- responsive dark-themed interface
- local browser persistence for demo-friendly state

The goal of the assignment was to show a practical approach to building a working dashboard, not a production-complete finance platform.

## Features

### Dashboard Overview

- Summary cards for `Total Balance`, `Income`, and `Expenses`
- Time-based chart showing a running balance trend
- Category-based chart showing expense breakdown by category

### Transactions Section

- Transaction table with:
  - date
  - category
  - type
  - amount
- Search by category, date, type, or amount
- Filter by transaction type
- Sort by date or amount
- Admin-only add, inline edit, and delete actions
- Delete confirmation prompt to reduce accidental removals
- Empty state when no matching transactions are found

### Role-Based UI

- `Viewer` role can view the dashboard data
- `Admin` role can add new transactions
- `Admin` role can edit existing transactions inline
- `Admin` role can delete transactions
- Role switching is simulated on the frontend using a dropdown for demonstration

### Insights

- Highest spending category
- Monthly comparison insight
- Net position summary
- Simple observation based on available expense data

### State Management

- React Context is used for shared application state
- Local component state is used for UI concerns like filters and form inputs
- Transactions and selected role are managed centrally through the app context
- State is persisted in local storage so refreshes keep the latest demo state

## Tech Stack

- React
- TypeScript
- Vite
- Recharts
- CSS

## Project Structure

```text
src/
  components/
    cards/
    charts/
    layout/
    transactions/
  context/
  data/
  pages/
  styles/
  types/
```

## Setup

### Prerequisites

- Node.js
- npm

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Approach

The dashboard is organized into focused components so each concern stays simple:

- `Navbar` handles role switching
- `Dashboard` composes the high-level sections
- `SummaryCard` shows key financial totals
- chart components visualize trend and category data
- `TransactionTable` manages transaction exploration and admin CRUD-style demo actions
- `Insights` derives lightweight observations from the transaction list

State was intentionally kept simple using Context because the app scope is small and the assignment does not require backend integration or advanced workflows.

## Assumptions

- Roles are simulated on the frontend only
- Mock transaction data is used as the starting dataset
- Insights are derived from the current transaction list
- Data is persisted locally in the browser for demonstration purposes

## Responsive Behavior

- Summary cards collapse cleanly on smaller screens
- Charts stack vertically on narrower viewports
- Filter and add-transaction controls stack for mobile readability
- The transaction table transforms into stacked mobile cards on small screens
- Wide layouts are constrained to the viewport to avoid mobile overflow

## Current Limitations

- No backend integration
- No authentication or real RBAC
- No server-side validation or multi-user sync
- Data persistence is local-only and tied to the current browser

## Evaluation Notes

This submission focuses on:

- clean component structure
- clear state flow
- readable UI
- reasonable handling of edge cases
- demonstrating how the problem was approached and implemented

## Scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint
