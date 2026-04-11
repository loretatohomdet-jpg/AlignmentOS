# Selling Physical Products with Amazon FBA (Option B)

**Marketplace: United States.**  
Use Amazon for storage, shipping, and delivery. No integration with the AlignmentOS app—run this as a separate business using Seller Central and FBA.

---

## 1. Get set up on Amazon (USA)

| Step | Action |
|------|--------|
| **Seller account** | Go to [Seller Central (US)](https://sellercentral.amazon.com). Sign up as a **Professional** ($39.99/mo, unlimited listings) or **Individual** (per-item fee, no monthly). |
| **Identity & tax** | Complete identity verification. For US sellers: provide **W-9** (tax ID/SSN) and state tax info where required. |
| **Bank account** | Add a US bank account for disbursements (direct deposit). |

---

## 2. Turn on FBA (Fulfillment by Amazon)

- In Seller Central: **Settings → Fulfillment by Amazon** (or **Inventory → Manage FBA**).
- **Enable FBA** for your account so you can send inventory to Amazon and use “Fulfilled by Amazon” on listings.

You’ll use:
- **FBA** = Amazon stores, picks, packs, ships, and handles returns for those units.
- **Seller Central** = where you create listings, manage inventory, and see orders/reports.

---

## 3. Create product listings

- **Inventory → Add a Product** (or “Sell on Amazon”).
- Either:
  - **Match to an existing ASIN** (if the product already exists on Amazon), or  
  - **Create a new product** (new ASIN) with title, images, description, category, etc.
- When setting the offer (price, quantity), choose **Fulfillment channel: Amazon (FBA)** so those units are fulfilled by Amazon.

---

## 4. Send inventory to Amazon

| Step | What to do |
|------|------------|
| **Create shipment** | **Inventory → Manage FBA Inventory** (or “Send to Amazon”). Create a new shipment. |
| **Prepare boxes** | Follow the packing and labeling rules (FNSKU labels if required, box content lists). |
| **Ship to FC** | Print the shipping label Amazon provides and ship the cartons to the assigned fulfillment center(s). |
| **Track** | In Seller Central you can track receipt and processing; once “Received,” units become available for sale. |

---

## 5. Ongoing: orders, storage, and fees

- **Orders**  
  When a customer buys an FBA unit, Amazon ships it. You see the order in **Orders → Manage Orders** (and in reports). You don’t ship it yourself.

- **Storage**  
  Amazon charges monthly **inventory storage fees** (per cubic foot). Keep stock levels and restock timing reasonable to avoid long-term storage charges.

- **Fulfillment fees**  
  For each unit Amazon ships, they charge a **fulfillment fee** (size/weight based). There are also **referral fees** (percentage of the sale). Check **Help → Fee schedule** in Seller Central for your marketplace.

---

## 6. Simple workflow summary

1. **List** products in Seller Central and set fulfillment to **FBA**.
2. **Send** inventory to Amazon (create shipment, label, ship to FC).
3. **Sell** — Amazon lists, sells, and ships; you get orders and payouts.
4. **Restock** when inventory runs low (create new FBA shipments as needed).
5. **Monitor** orders, returns, and fees in Seller Central and reports.

---

## 7. Useful links (United States)

- [Seller Central (US)](https://sellercentral.amazon.com)
- [Sell on Amazon (US)](https://sell.amazon.com) — overview and programs
- [FBA overview](https://sell.amazon.com/fulfillment-by-amazon)
- [FBA revenue calculator](https://sellercentral.amazon.com/hz/fba/profitabilitycalculator/index) — estimate fees and profit
- [FBA inventory & shipments (Help)](https://sellercentral.amazon.com/gp/help/200740930)
- [US selling fees](https://sellercentral.amazon.com/gp/help/200336920) — referral and FBA fees by category

---

## 8. Optional: keep a local checklist

You can keep a simple checklist (in a doc or spreadsheet) for each product:

- [ ] Listing created, FBA selected  
- [ ] First FBA shipment created and sent  
- [ ] Inventory received at FC  
- [ ] Pricing and ads (if any) set  
- [ ] Restock reminder date  

---

## 9. Link from the AlignmentOS app (where customers buy)

Customers don’t use Seller Central. They buy on **Amazon.com**. The app has a **Shop** menu that sends users to your Amazon store or product page.

- **Nav:** **Shop** (header + mobile menu + footer) → `/shop` page.
- **When you have your Amazon URL:** In the frontend project, add to `.env`:
  ```bash
  VITE_AMAZON_STORE_URL=https://www.amazon.com/s?me=YOUR_SELLER_ID
  ```
  Or use a direct product URL, e.g. `https://www.amazon.com/dp/B0XXXXXXX`. Then the Shop page shows a “Shop on Amazon” button that opens that link in a new tab.

- **Before you set the URL:** The Shop page shows “Coming soon” and the note about setting `VITE_AMAZON_STORE_URL`.

This doc is your reference for **Option B**: Amazon as the fulfillment engine, no code changes in AlignmentOS. For deeper automation later (e.g. SP-API, multi-channel), you can add tools separately.
