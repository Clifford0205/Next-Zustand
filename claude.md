## 專案建構指令
- 1.安裝Next.js:
npx create-next-app@latest [projectName] --typescript --eslint --app --tailwind --no-src-dir --no-turbopack --import-alias="@/*"

cd [projectName]

- 2.安裝tailwindcss:
npm install tailwindcss @tailwindcss/postcss postcss

- 3.安裝Shadcn:
npx shadcn@latest init
Which color would you like to use as the base color? › Slate


## 技術堆疊
- 框架：Next.js 15 App Router
- 語言：TypeScript 嚴格模式
- 樣式：Tailwind CSS v4+
- UI 套件：Shadcn UI
- 套件管理：npm
- 運行環境：Node.js 18+



## 專案架構
- `/app` - Next.js App Router 頁面與佈局
- `/components` - 可重複使用 UI 元件
- `/lib` - 工具函數與配置
- `/types` - TypeScript 類型定義
- `/public` - 靜態資源

## 開發命令
- 啟動開發伺服器：`npm run dev`
- 建立生產版本：`npm run build`
- 執行類型檢查：`npm run type-check`
- 運行測試：`npm test`
- 程式碼格式化：`npm run format`

## 程式碼風格規範

### React 元件
- 使用函數元件配合 TypeScript
- 元件名稱使用 PascalCase
- 檔案名稱使用 PascalCase：`UserCard.tsx`
- 使用命名導出，避免預設導出
- Props 介面名稱：元件名稱 + Props（如 `ButtonProps`）

### UI 規範 
- 優先使用Shadcn 有的component(例如:<Button>,<Input>...etc)
 
### Tailwind CSS 使用
- 只使用 Tailwind 工具類，不寫自訂 CSS
- 類別名稱順序：佈局 → 間距 → 顏色 → 狀態
- 響應式前綴使用：`sm:` `md:` `lg:` `xl:`
- 範例格式：`flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md`

### TypeScript 規範
- 所有函數參數和返回值必須有類型註解
- 介面定義優先使用 `interface` 而非 `type`
- 嚴格模式下不允許 `any` 類型
- 元件 Props 必須定義介面

### Next.js App Router 規範
- 頁面檔案：`page.tsx`
- 佈局檔：`layout.tsx`
- 載入狀態：`loading.tsx`
- 錯誤處理：`error.tsx`
- 預設使用 Server Components
- 需要客戶端互動時加入 `'use client'`

### 檔案命名約定
- 元件檔：`UserProfile.tsx`
- 頁面路由：`user-profile/page.tsx`
- 工具函數：`formatDate.ts`
- 類型定義：`UserTypes.ts`

## 測試規範
- 測試檔案命名：`ComponentName.test.tsx`
- 測試位置：與元件檔案相同目錄或 `__tests__` 資料夾
- 執行單一測試：`npm test -- ComponentName`
- 測試覆蓋率：`npm run test:coverage`

## Git 工作流程
- 分支命名：`feature/功能描述` 或 `fix/修復描述`
- 提交資訊：使用 conventional commits 格式
- 提交前必須通過類型檢查和測試
- 每個 PR 需要通過所有檢查

## 重要提醒
- 優先使用 Server Components 提升效能
- 組件保持單一職責，避免過於複雜
- 遵循 Tailwind 設計系統的一致性
- 始終處理載入和錯誤狀態
- 程式碼提交前執行 `npm run type-check`