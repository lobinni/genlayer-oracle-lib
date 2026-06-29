# 📤 Hướng dẫn Upload lên GitHub

## Bước 1: Tạo Repository trên GitHub

1. Đăng nhập vào [GitHub](https://github.com)
2. Click **"New repository"** (nút màu xanh)
3. Điền thông tin:
   - **Repository name:** `genlayer-reputation-oracle`
   - **Description:** `Decentralized AI-Powered Review Verification System on GenLayer`
   - **Public** (để mọi người xem được)
   - ❌ KHÔNG check "Add a README file" (vì đã có sẵn)
4. Click **"Create repository"**

## Bước 2: Clone và Push code

### Option A: Dùng Terminal (Recommended)

```bash
# 1. Di chuyển vào thư mục project
cd genlayer-reputation-oracle

# 2. Khởi tạo Git (nếu chưa có)
git init

# 3. Thêm tất cả files
git add .

# 4. Commit
git commit -m "Initial commit: GenLayer Reputation Oracle with genlayer-js SDK"

# 5. Thêm remote (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/genlayer-reputation-oracle.git

# 6. Push lên GitHub
git branch -M main
git push -u origin main
```

### Option B: Dùng GitHub Desktop

1. Download [GitHub Desktop](https://desktop.github.com/)
2. File → Add Local Repository → Chọn thư mục project
3. Commit to main
4. Publish repository

### Option C: Upload trực tiếp trên GitHub

1. Vào repository vừa tạo
2. Click **"uploading an existing file"**
3. Kéo thả tất cả files vào
4. Click **"Commit changes"**

## Bước 3: Enable GitHub Pages (Optional - để host demo)

1. Vào **Settings** → **Pages**
2. Source: chọn **GitHub Actions**
3. Workflow sẽ tự động chạy khi push code
4. Demo sẽ có tại: `https://YOUR_USERNAME.github.io/genlayer-reputation-oracle`

## Bước 4: Thêm Topics (Tags)

Vào repository → Click ⚙️ bên cạnh "About" → Thêm topics:
- `genlayer`
- `intelligent-contracts`
- `ai-consensus`
- `blockchain`
- `reputation-system`
- `web3`
- `react`
- `typescript`

## 📁 Files cần upload

```
genlayer-reputation-oracle/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── contracts/
│   └── ReputationOracle.py
├── docs/
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
├── src/
│   ├── components/
│   │   ├── ArchitectureDiagram.tsx
│   │   ├── ContractInteraction.tsx
│   │   ├── ContractView.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── NetworkInfo.tsx
│   │   └── TransactionPanel.tsx
│   ├── config/
│   │   └── genlayer.ts
│   ├── context/
│   │   └── WalletContext.tsx
│   ├── services/
│   │   └── genlayerSDK.ts
│   ├── utils/
│   │   └── cn.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## ✅ Checklist trước khi upload

- [ ] Đã test `npm run build` thành công
- [ ] Đã có file `.gitignore` (không upload node_modules)
- [ ] Đã có README.md với hướng dẫn đầy đủ
- [ ] Đã có LICENSE (MIT)
- [ ] Contract code trong `contracts/ReputationOracle.py`
- [ ] Không có private key trong code

## 🔗 Sau khi upload

Repository URL sẽ là:
```
https://github.com/YOUR_USERNAME/genlayer-reputation-oracle
```

Dùng URL này để submit lên GenLayer Portal!
