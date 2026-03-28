# AyurChain Development Task Split (Phase 2 & Beyond)

## 📌 Phase 1 Accomplishments Summarized
Before diving into Phase 2, here is what has been fully stabilized and implemented in Phase 1:
- ✅ **Smart Contracts:** Deployed & tested (`FarmerRegistry`, `BatchTracker`, `OwnershipTransfer`, `Certification`). Role-Based Access Control (RBAC) securely binds the blockchain supply-chain interactions.
- ✅ **Backend API:** Built in Node/Express/TS. Mongoose models (`User`, `Batch`, `LabReport`, `Certification`) configured. 10 RESTful controllers/routes are securely wired parsing IPFS file uploads and executing Blockchain writes.
- ✅ **Frontend Scaffold:** React/Vite/TypeScript `web/` directory built. Includes standard atomic components (`Tailwind CSS`, `HeadlessUI`), `Redux Toolkit` Thunks mapping fully to the API, and layout structures (`Navbar`, `ProtectedRoute`).

The core architecture is now battle-tested and ready for feature scaling.

---

## 👩‍💻 Dev A: Frontend Feature Completion (Dashboard Track)
**Context:** The frontend skeleton is complete, but the Dashboards need feature-completeness according to the React standard we established.

**Track Objectives:**
1. **Farmer Registration UI:** Flesh out the `Register Harvest` Modal. Form should capture herb name, harvest location, coordinates, quantity, and allow farmers to attach origin documents. Submits to `batchAPI.create`.
2. **Lab Testing Interface:** Build out the "Pending Queue" data-table. Add a "Submit Report" flow where Lab Techs attach PDF reports to batches transitioning them to `LabTesting`.
3. **Certification Hub:** Build the Certifier UI allowing organizations to approve items, emit the blockchain NFT-like certificate, and set expiry dates.

**Target Files to Modify/Create:**
- `web/src/pages/dashboard/FarmerDashboard.tsx` (Extract from `Dashboard.tsx`)
- `web/src/pages/dashboard/LabDashboard.tsx`
- `web/src/pages/dashboard/CertifierDashboard.tsx`
- `web/src/components/forms/HarvestForm.tsx`
- `web/src/components/forms/LabReportForm.tsx`

---

## 🧑‍💻 Dev B: Consumer Web-App & Explorer (Public Track)
**Context:** The consumer needs a flawless, trustless experience when scanning QR codes on AyurChain product packaging. The API provides the `ConsumerScanResult`.

**Track Objectives:**
1. **QR Code Generator Engine:** Within the Farmer/Processors dashboard (managed by Dev A), build a `QRGenerator` React Component that prints out `<QRCode value="https://ayurchain.com/scan/:token" />`. 
2. **Scan Result Refinement:** Greatly enhance `ScanResult.tsx`. Integrate an interactive Leaflet/Google Map detailing the coordinates of the Farm.
3. **Advanced Blockchain Explorer:** Build a dedicated `/explorer` page where anyone can paste a Batch ID or txHash to directly query immutable event data from the Polygon Mumbai network independently of our backend.

**Target Files to Modify/Create:**
- `web/src/components/common/QRBadge.tsx`
- `web/src/pages/consumer/ScanResult.tsx` (Inject Map logic)
- `web/src/pages/public/Explorer.tsx`
- `web/src/hooks/useBlockchainEvents.ts` (Utilize `ethers` to subscribe to events in real-time)

---

## 👨‍💻 Dev C: React Native Mobile Scaffold (Mobile Track)
**Context:** The `/mobile` directory is currently empty. We need a React Native/Expo app purely for Farmers to snap pictures of harvests and Processors/Brand Agents to scan QR codes seamlessly in warehouses.

**Track Objectives:**
1. **Project Scaffold:** Run `npx create-expo-app` inside the `mobile/` directory. Configure TypeScript and Tailwind (via Nativewind).
2. **Authentication Flow:** Create Login/Register screens consuming the exact same `axiosInstance` API endpoints designed for the Web.
3. **QR Scanner Wrapper:** Utilize `expo-camera` or `react-native-vision-camera` to build a scanning component. When a Processor scans a batch, it triggers the `transferBatch` stage progression.
4. **Offline Caching:** Implement offline-first storage so farmers in remote India can register harvests; syncing the data up to the backend via a background queue once connectivity is restored.

**Target Files to Modify/Create:**
- `mobile/package.json` & `mobile/app.json`
- `mobile/src/api/` (Mirror web network logic)
- `mobile/src/screens/AuthScreen.tsx`
- `mobile/src/screens/ScannerScreen.tsx`
- `mobile/src/services/SyncQueue.ts`
