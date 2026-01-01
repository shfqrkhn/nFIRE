# 🌌 nFIRE: The Singularity Solvency Engine

![Version](https://img.shields.io/badge/Version-1.0.0-neon)
![Status](https://img.shields.io/badge/Status-Gold%20Master-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Privacy](https://img.shields.io/badge/Data-Local%20Only-red)

> **nFIRE** is a deterministic financial independence engine. Unlike simple calculators that rely on the "4% Rule," nFIRE simulates your financial life year-by-year, strictly enforcing Canadian progressive tax brackets, RRSP meltdown strategies, and pension integration to determine your absolute solvency.

[**Live Demo**](https://shfqrkhn.github.io/nFIRE/)

![Screenshot](https://raw.githubusercontent.com/shfqrkhn/nFIRE/refs/heads/main/%7BACC736FF-639E-4E05-97B9-0754025950F0%7D.png)

---

## 📖 Table of Contents

1. [The Philosophy](#-the-philosophy)
2. [Quick Start](#-quick-start)
3. [User Manual (Pilot's Handbook)](#-user-manual-pilots-handbook)
   - [The Interface](#31-the-interface)
   - [Core Workflow](#32-core-workflow)
   - [Advanced Configuration](#33-advanced-configuration)
   - [Data Sovereignty](#34-data-sovereignty)
4. [Installation & Deployment](#-installation--deployment)
5. [Maintenance & Updates](#-maintenance--updates)
6. [Troubleshooting](#-troubleshooting)

---

## 🧠 The Philosophy

Most FIRE (Financial Independence, Retire Early) calculators are **Stochastic** (Monte Carlo) or **Heuristic** (Rule of 25). nFIRE is **Deterministic**.

*   **Real Physics:** It calculates exact tax liabilities (Federal + Provincial) for every future year based on your specific withdrawal needs.
*   **Meltdown Logic:** It automatically prioritizes withdrawals (TFSA $\to$ Non-Reg $\to$ RRSP) to maximize tax efficiency.
*   **Solvency > Probability:** It does not give you a "95% chance of success." It gives you a binary Solvency result based on the parameters you define.
*   **Offline First:** Your financial data is sensitive. nFIRE is a Static PWA. Once loaded, it runs entirely in your browser's memory. **No data is ever sent to a server.**

---

## 🚀 Quick Start

**Access the App:**
[Link to your hosted GitHub Pages URL]

**The Goal:**
Find your **nFIRE Date** (The year you can stop working) and your **Coast Date** (The year you can stop saving).

---

## 🕹️ User Manual (Pilot's Handbook)

### 3.1 The Interface

The application automatically adapts to your device:

*   **Mobile:** A vertical scroll optimized for quick inputs.
*   **Desktop:** A "Command Center" view.
    *   **Left Panel:** Physics Controls (Income, Savings, Spend).
    *   **Right Panel:** Telemetry (Real-time visualizations).

### 3.2 Core Workflow

Follow this sequence to calibrate the engine:

#### 1. Set the Zone 🇨🇦

Select your province (ON, AB, BC, NS).

> **Why?** This loads specific provincial tax brackets. A retiree in Nova Scotia pays significantly more tax on RRSP withdrawals than one in British Columbia. The engine accounts for this exact "Tax Drag."

#### 2. Calibrate Flows 💸

*   **Gross Income:** Your pre-tax annual salary.
*   **Injection (Savings):** How much you invest annually.
    *   *Auto-Sort:* The engine automatically fills tax-sheltered accounts first (TFSA $\to$ RRSP $\to$ Non-Reg).
*   **Burn Rate (Spend):** Your desired **after-tax** spending in retirement.
    *   *The Demand:* This is the net cash the engine must produce every year until age 95.

#### 3. Input Assets 🏦

Expand the **"Assets (Current)"** accordion and enter your current balances:

*   **RRSP:** Registered Retirement Savings Plan.
*   **TFSA:** Tax-Free Savings Account.
*   **Non-Reg:** Taxable Investment Accounts.

#### 4. Read Telemetry 📡

*   **The Reactor:** The radial gauge showing progress toward freedom.
*   **nFIRE Date:** The year you become fully solvent (work becomes optional).
*   **Coast Ready:** The year you can stop *saving* money, assuming you continue to work just enough to cover your daily costs.

### 3.3 Advanced Configuration

#### 🛡️ Defined Benefit Pensions

If you have a government or corporate DB pension:

1.  Click the **Shield Icon** in the console.
2.  Toggle **Pension Plan** to ON.
3.  Enter the **Annual Amount** and **Start Age**.
    *   *Effect:* This reduces the portfolio size required to retire, often accelerating your Freedom Date by years.

#### ⏱️ Timeline

Open the **Clock** section to adjust:

*   **Current Age:** The starting point (T=0).
*   **Target Retirement Age:** The age accumulation stops and decumulation begins.

#### 📈 Assumptions (The Trend)

Open the **Graph** section to tweak global variables:

*   **Real Growth Rate:** The investment return *minus* inflation. (Default: 5%).
*   **Tax Drag:** The percentage of Non-Registered growth lost to tax annually.

### 3.4 Data Sovereignty

*   **Save:** Click the ⬇️ (Download) icon to save your profile as a `.json` file.
*   **Load:** Click the ⬆️ (Upload) icon to restore a session.
*   **Report:** Click the 📄 (Table) icon to export a CSV of your year-by-year net worth.

---

## 💻 Installation & Deployment

If you wish to host this yourself or modify the code:

### Prerequisites

*   Node.js (v18+)

### Commands

```bash
# 1. Install Dependencies
npm install

# 2. Run Local Development Server
npm run dev

# 3. Build for Production (Creates /dist folder)
npm run build
```
